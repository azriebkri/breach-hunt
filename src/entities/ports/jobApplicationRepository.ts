import { JobApplication } from '../jobApplication';

interface JobApplicationRepository {
  findByJobId(jobId: string): Promise<JobApplication[]>;
  save(application: JobApplication): Promise<JobApplication>;
  archiveOldApplications(beforeDate: Date): Promise<number>;
  sendFollowUp(applicationId: string): Promise<void>;
  exportToCsv(jobId: string): Promise<string>;
  getApplicantMetrics(): Promise<{
    total: number;
    uniqueApplicants: number;
  }>;
}

export { JobApplicationRepository };
