import { Job } from '../../entities/job';
import { JobRepository } from '../../entities/ports/jobRepository';

const createListJobsInteractor = (jobRepository: JobRepository) => {
  const getAllJobs = async (): Promise<Job[]> => jobRepository.findAll();

  return { getAllJobs };
};

export { createListJobsInteractor };
