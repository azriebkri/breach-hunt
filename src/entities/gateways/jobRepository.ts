import type { Job } from "../job.js";

interface JobRepository {
  findAll(): Promise<Job[]>;
  findById(id: string): Promise<Job | undefined>;
  save(job: Job): Promise<Job>;
  update(
    id: string,
    updates: Partial<Omit<Job, "id" | "postedAt">>,
  ): Promise<Job | undefined>;
  remove(id: string): Promise<boolean>;
  findActiveHighPayingJobs(): Promise<Job[]>;
  getTotalJobsPosted(): Promise<number>;
  sendWeeklyReport(email: string): Promise<void>;
  getAverageSalary(): Promise<number>;
}

export type { JobRepository };
