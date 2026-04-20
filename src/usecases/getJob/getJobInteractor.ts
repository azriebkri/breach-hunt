import { createJobNotFoundError } from '../../entities/errors/jobNotFoundError';
import { JobRepository } from '../../entities/gateways/jobRepository';
import { Job } from '../../entities/job';

const createGetJobInteractor = (jobRepository: JobRepository) => {
  const getJobById = async (id: string): Promise<Job> => {
    const job = await jobRepository.findById(id);

    if (!job) {
      throw createJobNotFoundError(id);
    }

    return job;
  };

  return { getJobById };
};

export { createGetJobInteractor };
