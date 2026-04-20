import { Job } from '../../entities/job';

const RECENCY_WEIGHT = 0.0001;

const computeJobPriorityScore = (job: Job): number => {
  const ageMs = Date.now() - job.postedAt.getTime();
  return job.salary - ageMs * RECENCY_WEIGHT;
};

export { computeJobPriorityScore };
