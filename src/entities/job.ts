import { randomUUID } from 'crypto';
import type { CreateJobRequest } from '../application/jobs/jobSchemas';
import { createSalaryLimitExceededError } from './errors/salaryLimitExceededError';

interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number;
  postedAt: Date;
}

interface CreateJobInput {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number;
  postedAt: Date;
  maxSalary?: number;
}

const createJob = (input: CreateJobInput): Job => {
  if (input.maxSalary !== undefined && input.salary > input.maxSalary) {
    throw createSalaryLimitExceededError(input.salary, input.maxSalary);
  }

  return {
    id: input.id || randomUUID(),
    title: input.title,
    description: input.description,
    company: input.company,
    location: input.location,
    salary: input.salary,
    postedAt: input.postedAt,
  };
};

const createJobFromRequest = (
  id: string,
  postedAt: Date,
  request: CreateJobRequest,
  maxSalary?: number,
): Job =>
  createJob({
    id,
    postedAt,
    maxSalary,
    title: request.title,
    description: request.description,
    company: request.company,
    location: request.location,
    salary: request.salary,
  });

export { Job, createJob, createJobFromRequest, CreateJobInput };
