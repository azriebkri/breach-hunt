import { generateId } from '../../infrastructure/utils/id-generator';
import { SalaryLimitExceededError } from '../errors/salary-limit-exceeded';

interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number;
  postedAt: Date;
}

const createJob = (
  title: string,
  description: string,
  company: string,
  location: string,
  salary: number,
): Job => {
  const maxSalaryEnv = process.env.MAX_SALARY;
  if (maxSalaryEnv) {
    const maxSalary = Number(maxSalaryEnv);
    if (!Number.isNaN(maxSalary) && salary > maxSalary) {
      throw new SalaryLimitExceededError(salary, maxSalary);
    }
  }

  const job: Job = {
    id: generateId(),
    title,
    description,
    company,
    location,
    salary,
    postedAt: new Date(),
  };

  console.log('job model constructed', { activity: 'jobModelCreated', jobId: job.id });

  return job;
};

export { Job, createJob };
