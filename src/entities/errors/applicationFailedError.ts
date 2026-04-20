class ApplicationFailedError extends Error {
  public readonly jobId: string;
  public readonly reason: string;

  constructor(jobId: string, reason: string) {
    super(`Application to job '${jobId}' failed: ${reason}`);
    this.name = 'ApplicationFailedError';
    this.jobId = jobId;
    this.reason = reason;
  }
}

export { ApplicationFailedError };
