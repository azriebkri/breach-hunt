import { Request, Response, NextFunction } from 'express';
import { isApplicationFailedError } from '../../entities/errors/applicationFailedError';
import { isJobNotFoundError } from '../../entities/errors/jobNotFoundError';
import { isSalaryLimitExceededError } from '../../entities/errors/salaryLimitExceededError';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (isJobNotFoundError(err)) {
    res.status(404).json({ error: err.message, jobId: err.jobId });
    return;
  }

  if (isApplicationFailedError(err)) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (isSalaryLimitExceededError(err)) {
    res.status(422).json({
      error: err.message,
      salary: err.salary,
      max: err.max,
    });
    return;
  }

  if (err.name === 'ZodError') {
    res.status(400).json({ error: 'Validation failed', details: err });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
};

export { errorHandler };
