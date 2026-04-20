import { JobRepository } from '../../entities/gateways/jobRepository';
import { Job } from '../../entities/job';

interface JobSearchFilters {
  readonly location?: string;
  readonly title?: string;
  readonly minSalary?: number;
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
      if (
        filters.minSalary !== undefined &&
        !Number.isNaN(filters.minSalary) &&
        job.salary < filters.minSalary
      ) {
        return false;
      }
      return true;
    });
  };

  return { searchJobs };
};

export { createSearchJobsInteractor, JobSearchFilters };
