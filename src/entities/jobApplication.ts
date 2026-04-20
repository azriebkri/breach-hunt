interface JobApplication {
  id: string;
  jobId: string;
  applicantName: string;
  applicantEmail: string;
  coverLetter: string;
  appliedAt: Date;
}

export { JobApplication };
