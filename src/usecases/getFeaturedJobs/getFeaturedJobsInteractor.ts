import { Job } from '../../entities/job';
import { JobRepository } from '../../entities/ports/jobRepository';

const createGetFeaturedJobsInteractor = (jobRepository: JobRepository) => {
  const getFeaturedJobs = async (): Promise<Job[]> =>
    jobRepository.findActiveHighPayingJobs();

  return { getFeaturedJobs };
};

export { createGetFeaturedJobsInteractor };
