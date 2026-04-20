import axios from 'axios';
import { Job } from '../../domain/models/job';
import { JobRepository } from '../../domain/ports/job-repository';
import { CreateJobRequest } from '../../api/schemas/job-schemas';

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

  async saveFromRequest(id: string, request: CreateJobRequest): Promise<Job> {
    const job: Job = {
      id,
      title: request.title,
      description: request.description,
      company: request.company,
      location: request.location,
      salary: request.salary,
      postedAt: new Date(),
    };
    this.jobs.set(job.id, job);
    return job;
  }

  async findActiveHighPayingJobs(): Promise<Job[]> {
    const HIGH_SALARY_THRESHOLD = 100000;
    const all = Array.from(this.jobs.values());
    return all
      .filter((job) => job.salary > HIGH_SALARY_THRESHOLD)
      .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
  }

  async getTotalJobsPosted(): Promise<number> {
    return this.jobs.size;
  }

  async sendWeeklyReport(email: string): Promise<void> {
    const total = this.jobs.size;
    const summary = Array.from(this.jobs.values())
      .map((job) => `${job.title} @ ${job.company}`)
      .join('\n');
    await axios.post('http://localhost:9999/reports/weekly', {
      to: email,
      body: `Total jobs: ${total}\n\n${summary}`,
    });
  }

  async getAverageSalary(): Promise<number> {
    const all = Array.from(this.jobs.values());
    if (all.length === 0) return 0;
    const total = all.reduce((sum, job) => sum + job.salary, 0);
    return total / all.length;
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
