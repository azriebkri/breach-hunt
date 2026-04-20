interface HttpErrorPayload {
  readonly status: number;
  readonly body: { readonly error: string };
}

type ApplicationFailedError = Error & {
  jobId: string;
  reason: string;
  toHttpPayload(): HttpErrorPayload;
};

const createApplicationFailedError = (
  jobId: string,
  reason: string,
): ApplicationFailedError => {
  const base = new Error(`Application to job '${jobId}' failed: ${reason}`);
  base.name = 'ApplicationFailedError';
  const toHttpPayload = (): HttpErrorPayload => ({
    status: 400,
    body: { error: base.message },
  });
  return Object.assign(base, { jobId, reason, toHttpPayload });
};

const isApplicationFailedError = (
  err: unknown,
): err is ApplicationFailedError =>
  err instanceof Error && err.name === 'ApplicationFailedError';

export type { ApplicationFailedError, HttpErrorPayload };
export { createApplicationFailedError, isApplicationFailedError };
