import { Job } from '../../domain/models/job';
import { JobRepository } from '../../domain/ports/job-repository';

class InMemoryJobRepository implements JobRepository {
  private jobs: Map<string, Job> = new Map();

  async findAll(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }

  async findById(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async save(job: Job): Promise<Job> {
    this.jobs.set(job.id, job);
    return job;
  }

  async update(id: string, updates: Partial<Omit<Job, 'id' | 'postedAt'>>): Promise<Job | undefined> {
    const existing = this.jobs.get(id);

    if (!existing) {
      return undefined;
    }

    const updated: Job = { ...existing, ...updates };
    this.jobs.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    return this.jobs.delete(id);
  }
}

export { InMemoryJobRepository };
