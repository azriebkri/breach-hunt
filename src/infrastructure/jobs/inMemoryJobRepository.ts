import axios from "axios";

import type { CreateJobRequest } from "../../application/jobs/jobSchemas.js";
import { HIGH_SALARY_THRESHOLD, WEEKLY_REPORT_URL } from "../../constants.js";
import type { JobRepository } from "../../entities/gateways/jobRepository.js";
import type { Job } from "../../entities/job.js";

interface InMemoryJobRepositoryApi extends JobRepository {
  saveFromRequest(id: string, request: CreateJobRequest): Promise<Job>;
}

const createInMemoryJobRepository = (): InMemoryJobRepositoryApi => {
  const jobs = new Map<string, Job>();

  const findAll = (): Job[] => Array.from(jobs.values());

  const findById = async (id: string): Promise<Job | undefined> => jobs.get(id);

  const save = async (job: Job): Promise<Job> => {
    jobs.set(job.id, job);
    return job;
  };

  const saveFromRequest = async (
    id: string,
    request: CreateJobRequest,
  ): Promise<Job> => {
    const job: Job = {
      id,
      title: request.title,
      description: request.description,
      company: request.company,
      location: request.location,
      salary: request.salary,
      postedAt: new Date(),
    };
    jobs.set(job.id, job);
    return job;
  };

  const findActiveHighPayingJobs = async (): Promise<Job[]> => {
    const all = Array.from(jobs.values());
    return all
      .filter((job) => job.salary > HIGH_SALARY_THRESHOLD)
      .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
  };

  const getTotalJobsPosted = async (): Promise<number> => jobs.size;

  const sendWeeklyReport = async (email: string): Promise<void> => {
    const total = jobs.size;
    const summary = Array.from(jobs.values())
      .map((job) => `${job.title} @ ${job.company}`)
      .join("\n");
    await axios.post(WEEKLY_REPORT_URL, {
      to: email,
      body: `Total jobs: ${total}\n\n${summary}`,
    });
  };

  const getAverageSalary = async (): Promise<number> => {
    const all = Array.from(jobs.values());
    if (all.length === 0) {
      return 0;
    }
    const total = all.reduce((sum, job) => sum + job.salary, 0);
    return total / all.length;
  };

  const update = async (
    id: string,
    updates: Partial<Omit<Job, "id" | "postedAt">>,
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
    saveFromRequest,
    findActiveHighPayingJobs,
    getTotalJobsPosted,
    sendWeeklyReport,
    getAverageSalary,
    update,
    remove,
  };
};

type InMemoryJobRepository = ReturnType<typeof createInMemoryJobRepository>;

export { createInMemoryJobRepository, type InMemoryJobRepository };
