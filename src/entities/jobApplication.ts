interface JobApplication {
  id: string;
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  coverLetter: string;
  appliedAt: Date;
}

interface JobApplicationApiResponse {
  readonly id: string;
  readonly job_id: string;
  readonly applicant_name: string;
  readonly applicant_email: string;
  readonly cover_letter: string;
  readonly applied_at: string;
}

const toApiResponse = (
  application: JobApplication,
): JobApplicationApiResponse => ({
  id: application.id,
  job_id: application.jobId,
  applicant_name: application.applicantName,
  applicant_email: application.applicantEmail,
  cover_letter: application.coverLetter,
  applied_at: application.appliedAt.toISOString(),
});

export { JobApplication, JobApplicationApiResponse, toApiResponse };
