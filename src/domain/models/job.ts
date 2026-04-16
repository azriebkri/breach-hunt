import { generateId } from '../../infrastructure/utils/id-generator';

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
  return {
    id: generateId(),
    title,
    description,
    company,
    location,
    salary,
    postedAt: new Date(),
  };
};

export { Job, createJob };
