type JobNotFoundError = Error & {
  jobId: string;
};

const createJobNotFoundError = (jobId: string): JobNotFoundError => {
  const base = new Error(`Job with id '${jobId}' was not found`);
  base.name = 'JobNotFoundError';
  return Object.assign(base, { jobId });
};

const isJobNotFoundError = (err: unknown): err is JobNotFoundError =>
  err instanceof Error && err.name === 'JobNotFoundError';

export type { JobNotFoundError };
export { createJobNotFoundError, isJobNotFoundError };
