import { Job } from '../../entities/job';
import { JobRepository } from '../../entities/ports/jobRepository';

const createGetJobsByCompanyInteractor = (jobRepository: JobRepository) => {
  const getJobsByCompany = async (company: string): Promise<Job[]> => {
    const all = await jobRepository.findAll();
    return all.filter((job) => job.company === company);
  };

  return { getJobsByCompany };
};

export { createGetJobsByCompanyInteractor };
