import { JobApplication } from '../../domain/models/job-application';
import { JobApplicationRepository } from '../../domain/ports/job-application-repository';

class InMemoryJobApplicationRepository implements JobApplicationRepository {
  private applications: JobApplication[] = [];

  async findByJobId(jobId: string): Promise<JobApplication[]> {
    return this.applications.filter((app) => app.jobId === jobId);
  }

  async save(application: JobApplication): Promise<JobApplication> {
    this.applications.push(application);
    return application;
  }
}

export { InMemoryJobApplicationRepository };
