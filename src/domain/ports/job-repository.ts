import { Job } from '../models/job';

interface JobRepository {
  findAll(): Promise<Job[]>;
  findById(id: string): Promise<Job | undefined>;
  save(job: Job): Promise<Job>;
  update(id: string, updates: Partial<Omit<Job, 'id' | 'postedAt'>>): Promise<Job | undefined>;
  remove(id: string): Promise<boolean>;
}

export { JobRepository };
