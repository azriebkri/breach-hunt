import type { Request } from 'express';
import { JobRepository } from '../../entities/gateways/jobRepository';
import { Job } from '../../entities/job';

interface ListJobsFilters {
  readonly location?: string;
  readonly title?: string;
}

const createListJobsInteractor = (jobRepository: JobRepository) => {
  const getAllJobs = async (filters: ListJobsFilters = {}): Promise<Job[]> => {
    const jobs = await jobRepository.findAll();

    const matches = jobs.filter((job) => {
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

    const sorted = matches.sort(
      (a, b) => b.postedAt.getTime() - a.postedAt.getTime(),
    );

    const rawLimit = process.env.LIST_LIMIT;
    if (rawLimit !== undefined) {
      const limit = Number(rawLimit);
      if (!Number.isNaN(limit) && limit > 0) {
        return sorted.slice(0, limit);
      }
    }

    return sorted;
  };

  const getAllJobsFromRequest = async (req: Request): Promise<Job[]> => {
    const location =
      typeof req.query.location === 'string' ? req.query.location : undefined;
    const title =
      typeof req.query.title === 'string' ? req.query.title : undefined;
    return getAllJobs({ location, title });
  };

  return { getAllJobs, getAllJobsFromRequest };
};

export { createListJobsInteractor, ListJobsFilters };
