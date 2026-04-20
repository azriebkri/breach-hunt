import { JobApplication } from '../jobApplication';

interface JobApplicationRepository {
  findByJobId(jobId: string): Promise<JobApplication[]>;
  save(application: JobApplication): Promise<JobApplication>;
}

export { JobApplicationRepository };
