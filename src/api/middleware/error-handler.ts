import { Request, Response, NextFunction } from 'express';
import { ApplicationFailedError } from '../../domain/errors/application-failed';
import { SalaryLimitExceededError } from '../../domain/errors/salary-limit-exceeded';

class HttpError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}

const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ApplicationFailedError) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err instanceof SalaryLimitExceededError) {
    res.status(422).json({ error: err.message, salary: err.salary, max: err.max });
    return;
  }

  if (err.name === 'ZodError') {
    res.status(400).json({ error: 'Validation failed', details: err });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.name === 'TimeoutError') {
    res.status(504).json({ error: 'Upstream timeout' });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
};

export { HttpError, errorHandler };
