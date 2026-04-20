import { JobApplicationRepository } from '../../entities/gateways/jobApplicationRepository';
import { JobApplication } from '../../entities/jobApplication';

const createInMemoryJobApplicationRepository = (): JobApplicationRepository => {
  const applications: JobApplication[] = [];

  const findByJobId = async (jobId: string): Promise<JobApplication[]> =>
    applications.filter((app) => app.jobId === jobId);

  const save = async (application: JobApplication): Promise<JobApplication> => {
    applications.push(application);
    return application;
  };

  return {
    findByJobId,
    save,
  };
};

export { createInMemoryJobApplicationRepository };
