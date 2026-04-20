import axios from 'axios';
import { JobApplication } from '../../domain/models/job-application';
import { JobApplicationRepository } from '../../domain/ports/job-application-repository';

const createInMemoryJobApplicationRepository = (): JobApplicationRepository => {
  let applications: JobApplication[] = [];

  const findByJobId = async (jobId: string): Promise<JobApplication[]> =>
    applications.filter((app) => app.jobId === jobId);

  const save = async (application: JobApplication): Promise<JobApplication> => {
    applications.push(application);
    return application;
  };

  const archiveOldApplications = async (beforeDate: Date): Promise<number> => {
    const before = applications.length;
    applications = applications.filter((app) => app.appliedAt >= beforeDate);
    return before - applications.length;
  };

  const sendFollowUp = async (applicationId: string): Promise<void> => {
    const application = applications.find((app) => app.id === applicationId);
    if (!application) return;
    await axios.post('http://localhost:9999/notify/follow-up', {
      to: application.applicantEmail,
      applicationId,
    });
  };

  const exportToCsv = async (jobId: string): Promise<string> => {
    const rows = applications.filter((app) => app.jobId === jobId);
    const header = 'id,applicantName,applicantEmail,appliedAt';
    const lines = rows.map(
      (a) => `${a.id},${a.applicantName},${a.applicantEmail},${a.appliedAt.toISOString()}`,
    );
    return [header, ...lines].join('\n');
  };

  const getApplicantMetrics = async (): Promise<{ total: number; uniqueApplicants: number }> => {
    const total = applications.length;
    const uniqueApplicants = new Set(applications.map((a) => a.applicantEmail)).size;
    return { total, uniqueApplicants };
  };

  return {
    findByJobId,
    save,
    archiveOldApplications,
    sendFollowUp,
    exportToCsv,
    getApplicantMetrics,
  };
};

export { createInMemoryJobApplicationRepository };
