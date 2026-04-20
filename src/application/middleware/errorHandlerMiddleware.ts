import { Request, Response, NextFunction } from 'express';
import { isApplicationFailedError } from '../../entities/errors/applicationFailedError';
import { isSalaryLimitExceededError } from '../../entities/errors/salaryLimitExceededError';

type HttpError = Error & { statusCode: number };

const createHttpError = (statusCode: number, message: string): HttpError => {
  const base = new Error(message);
  base.name = 'HttpError';
  return Object.assign(base, { statusCode });
};

const isHttpError = (err: unknown): err is HttpError => {
  if (!(err instanceof Error)) return false;
  if (!('statusCode' in err)) return false;
  return typeof err.statusCode === 'number';
};

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (isHttpError(err)) {
    res.status(err.statusCode).json({ error: err.message });
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

export type { HttpError };
export { createHttpError, isHttpError, errorHandler };
