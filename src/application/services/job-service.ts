import { Job, createJob } from '../../domain/models/job';
import { JobRepository } from '../../domain/ports/job-repository';
import { HttpError } from '../../api/middleware/error-handler';

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
    const job = createJob(
      params.title,
      params.description,
      params.company,
      params.location,
      params.salary,
    );
    return jobRepository.save(job);
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

  const updateJob = async (
    id: string,
    updates: Partial<Omit<Job, 'id' | 'postedAt'>>,
  ): Promise<Job> => {
    const updated = await jobRepository.update(id, updates);

    if (!updated) {
      throw new HttpError(404, 'Job not found');
    }

    return updated;
  };

  const removeJob = async (id: string): Promise<void> => {
    const removed = await jobRepository.remove(id);

    if (!removed) {
      throw new HttpError(404, 'Job not found');
    }
  };

  return {
    getAllJobs,
    getJobById,
    addJob,
    searchJobs,
    updateJob,
    removeJob,
  };
};

export { createJobService, CreateJobParams };
