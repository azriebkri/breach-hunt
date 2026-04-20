import { Job } from '../../entities/job';
import { JobRepository } from '../../entities/gateways/jobRepository';
import { createHttpError } from '../../application/middleware/errorHandlerMiddleware';

const createGetJobInteractor = (jobRepository: JobRepository) => {
  const getJobById = async (id: string): Promise<Job> => {
    const job = await jobRepository.findById(id);

    if (!job) {
      throw createHttpError(404, 'Job not found');
    }

    return job;
  };

  return { getJobById };
};

export { createGetJobInteractor };
