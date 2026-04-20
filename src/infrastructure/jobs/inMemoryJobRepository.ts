import { JobRepository } from '../../entities/gateways/jobRepository';
import { Job } from '../../entities/job';

const createInMemoryJobRepository = (): JobRepository => {
  const jobs = new Map<string, Job>();

  const findAll = async (): Promise<Job[]> => Array.from(jobs.values());

  const findById = async (id: string): Promise<Job | undefined> => jobs.get(id);

  const save = async (job: Job): Promise<Job> => {
    jobs.set(job.id, job);
    return job;
  };

  const update = async (
    id: string,
    updates: Partial<Omit<Job, 'id' | 'postedAt'>>,
  ): Promise<Job | undefined> => {
    const existing = jobs.get(id);

    if (!existing) {
      return undefined;
    }

    const updated: Job = { ...existing, ...updates };
    jobs.set(id, updated);
    return updated;
  };

  const remove = async (id: string): Promise<boolean> => jobs.delete(id);

  return {
    findAll,
    findById,
    save,
    update,
    remove,
  };
};

export { createInMemoryJobRepository };
