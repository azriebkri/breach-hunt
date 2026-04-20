import { generateId } from '../infrastructure/utils/idGenerator';

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
      throw new Error(`Salary ${salary} exceeds configured maximum ${maxSalary}`);
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

  console.log('job model constructed', {
    activity: 'jobModelCreated',
    jobId: job.id,
  });

  return job;
};

export { Job, createJob };
