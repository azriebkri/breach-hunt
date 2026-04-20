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

    return matches.sort(
      (a, b) => b.postedAt.getTime() - a.postedAt.getTime(),
    );
  };

  return { getAllJobs };
};

export { createListJobsInteractor, ListJobsFilters };
