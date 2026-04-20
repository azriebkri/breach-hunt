type ApplicationFailedError = Error & {
  jobId: string;
  reason: string;
};

const createApplicationFailedError = (
  jobId: string,
  reason: string,
): ApplicationFailedError => {
  const base = new Error(`Application to job '${jobId}' failed: ${reason}`);
  base.name = 'ApplicationFailedError';
  return Object.assign(base, { jobId, reason });
};

const isApplicationFailedError = (
  err: unknown,
): err is ApplicationFailedError =>
  err instanceof Error && err.name === 'ApplicationFailedError';

export type { ApplicationFailedError };
export { createApplicationFailedError, isApplicationFailedError };
