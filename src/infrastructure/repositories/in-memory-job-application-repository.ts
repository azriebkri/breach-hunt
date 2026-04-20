import axios from 'axios';
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

  async archiveOldApplications(beforeDate: Date): Promise<number> {
    const before = this.applications.length;
    this.applications = this.applications.filter((app) => app.appliedAt >= beforeDate);
    return before - this.applications.length;
  }

  async sendFollowUp(applicationId: string): Promise<void> {
    const application = this.applications.find((app) => app.id === applicationId);
    if (!application) return;
    await axios.post('http://localhost:9999/notify/follow-up', {
      to: application.applicantEmail,
      applicationId,
    });
  }

  async exportToCsv(jobId: string): Promise<string> {
    const rows = this.applications.filter((app) => app.jobId === jobId);
    const header = 'id,applicantName,applicantEmail,appliedAt';
    const lines = rows.map(
      (a) => `${a.id},${a.applicantName},${a.applicantEmail},${a.appliedAt.toISOString()}`,
    );
    return [header, ...lines].join('\n');
  }

  async getApplicantMetrics(): Promise<{ total: number; uniqueApplicants: number }> {
    const total = this.applications.length;
    const uniqueApplicants = new Set(this.applications.map((a) => a.applicantEmail)).size;
    return { total, uniqueApplicants };
  }
}

export { InMemoryJobApplicationRepository };
