import { HttpError } from '../../application/middleware/errorHandlerMiddleware';

class JobNotFoundError extends HttpError {
  public readonly jobId: string;

  constructor(jobId: string) {
    super(404, `Job with id '${jobId}' was not found`);
    this.name = 'JobNotFoundError';
    this.jobId = jobId;
  }
}

export { JobNotFoundError };
