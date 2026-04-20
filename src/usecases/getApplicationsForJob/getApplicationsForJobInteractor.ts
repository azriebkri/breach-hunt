import { JobApplication } from '../../entities/jobApplication';
import { JobApplicationRepository } from '../../entities/gateways/jobApplicationRepository';

const createGetApplicationsForJobInteractor = (
  applicationRepository: JobApplicationRepository,
) => {
  const getApplicationsForJob = async (
    jobId: string,
  ): Promise<JobApplication[]> => applicationRepository.findByJobId(jobId);

  return { getApplicationsForJob };
};

export { createGetApplicationsForJobInteractor };
