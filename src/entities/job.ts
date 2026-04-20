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
    id: input.id,
    title: input.title,
    description: input.description,
    company: input.company,
    location: input.location,
    salary: input.salary,
    postedAt: input.postedAt,
  };
};

export { Job, createJob, CreateJobInput };
