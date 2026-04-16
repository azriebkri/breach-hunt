class JobNotFoundError extends Error {
  public readonly jobId: string;

  constructor(jobId: string) {
    super(`Job with id '${jobId}' was not found`);
    this.name = 'JobNotFoundError';
    this.jobId = jobId;
  }
}

export { JobNotFoundError };
