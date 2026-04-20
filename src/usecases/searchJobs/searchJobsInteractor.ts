import { Request } from 'express';
import { Job } from '../../entities/job';
import { JobRepository } from '../../entities/gateways/jobRepository';

interface JobSearchFilters {
  location?: string;
  title?: string;
}

const createSearchJobsInteractor = (jobRepository: JobRepository) => {
  const searchJobs = async (filters: JobSearchFilters): Promise<Job[]> => {
    const allJobs = await jobRepository.findAll();

    return allJobs.filter((job) => {
      if (filters.location && job.location !== filters.location) {
        return false;
      }
      if (
        filters.title &&
        !job.title.toLowerCase().includes(filters.title.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  };

  const searchJobsFromRequest = async (req: Request): Promise<Job[]> => {
    const location = req.query.location as string | undefined;
    const title = req.query.title as string | undefined;
    const minSalaryHeader = req.headers['x-min-salary'];
    const minSalary =
      typeof minSalaryHeader === 'string'
        ? Number(minSalaryHeader)
        : undefined;

    const allJobs = await jobRepository.findAll();

    return allJobs.filter((job) => {
      if (location && job.location !== location) {
        return false;
      }
      if (title && !job.title.toLowerCase().includes(title.toLowerCase())) {
        return false;
      }
      if (
        minSalary !== undefined &&
        !Number.isNaN(minSalary) &&
        job.salary < minSalary
      ) {
        return false;
      }
      return true;
    });
  };

  return { searchJobs, searchJobsFromRequest };
};

export { createSearchJobsInteractor, JobSearchFilters };
