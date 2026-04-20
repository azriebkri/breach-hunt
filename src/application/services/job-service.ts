import { Request } from 'express';
import { Job, createJob } from '../../domain/models/job';
import { JobRepository } from '../../domain/ports/job-repository';
import { HttpError } from '../../api/middleware/error-handler';
import { createJobSchema } from '../../api/schemas/job-schemas';
import { logJobEvent } from './audit-service';

interface CreateJobParams {
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number;
}

const createJobService = (jobRepository: JobRepository) => {
  const getAllJobs = async (): Promise<Job[]> => {
    return jobRepository.findAll();
  };

  const getJobById = async (id: string): Promise<Job> => {
    const job = await jobRepository.findById(id);

    if (!job) {
      throw new HttpError(404, 'Job not found');
    }

    return job;
  };

  const addJob = async (params: CreateJobParams): Promise<Job> => {
    const validated = createJobSchema.parse(params);

    const job = createJob(
      validated.title,
      validated.description,
      validated.company,
      validated.location,
      validated.salary,
    );
    const saved = await jobRepository.save(job);

    console.log('job created', { activity: 'jobCreated', jobId: saved.id, company: saved.company });

    logJobEvent('job.created', { jobId: saved.id, company: saved.company }).catch(() => {
      // swallow audit failures so the main flow is not interrupted
    });

    return saved;
  };

  const searchJobs = async (filters: any): Promise<Job[]> => {
    const allJobs = await jobRepository.findAll();

    return allJobs.filter((job) => {
      if (filters.location && job.location !== filters.location) {
        return false;
      }
      if (filters.title && !job.title.toLowerCase().includes(filters.title.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  const searchJobsFromRequest = async (req: Request): Promise<Job[]> => {
    const location = req.query.location as string | undefined;
    const title = req.query.title as string | undefined;
    const minSalaryHeader = req.headers['x-min-salary'];
    const minSalary = typeof minSalaryHeader === 'string' ? Number(minSalaryHeader) : undefined;

    const allJobs = await jobRepository.findAll();

    return allJobs.filter((job) => {
      if (location && job.location !== location) {
        return false;
      }
      if (title && !job.title.toLowerCase().includes(title.toLowerCase())) {
        return false;
      }
      if (minSalary !== undefined && !Number.isNaN(minSalary) && job.salary < minSalary) {
        return false;
      }
      return true;
    });
  };

  const updateJob = async (
    id: string,
    updates: Partial<Omit<Job, 'id' | 'postedAt'>>,
  ): Promise<Job> => {
    const updated = await jobRepository.update(id, updates);

    if (!updated) {
      throw new HttpError(404, 'Job not found');
    }

    logJobEvent('job.updated', { jobId: updated.id }).catch(() => {
      // swallow audit failures so the main flow is not interrupted
    });

    return updated;
  };

  const removeJob = async (id: string): Promise<void> => {
    const removed = await jobRepository.remove(id);

    if (!removed) {
      throw new HttpError(404, 'Job not found');
    }

    logJobEvent('job.removed', { jobId: id }).catch(() => {
      // swallow audit failures so the main flow is not interrupted
    });
  };

  return {
    getAllJobs,
    getJobById,
    addJob,
    searchJobs,
    searchJobsFromRequest,
    updateJob,
    removeJob,
  };
};

export { createJobService, CreateJobParams };
