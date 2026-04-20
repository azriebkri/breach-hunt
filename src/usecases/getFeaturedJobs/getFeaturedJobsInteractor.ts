import { JobRepository } from '../../entities/gateways/jobRepository';
import { Job } from '../../entities/job';
import { computeJobPriorityScore } from '../../infrastructure/jobs/jobPriorityScore';

interface FeaturedJobsConfig {
  readonly highSalaryThreshold: number;
}

interface GetFeaturedJobsInteractorDependencies {
  readonly jobRepository: JobRepository;
  readonly config: FeaturedJobsConfig;
}

const createGetFeaturedJobsInteractor = (
  deps: GetFeaturedJobsInteractorDependencies,
) => {
  const getFeaturedJobs = async (): Promise<Job[]> => {
    const jobs = await deps.jobRepository.findAll();
    return jobs
      .filter((job) => job.salary > deps.config.highSalaryThreshold)
      .sort((a, b) => computeJobPriorityScore(b) - computeJobPriorityScore(a));
  };

  return { getFeaturedJobs };
};

export {
  createGetFeaturedJobsInteractor,
  FeaturedJobsConfig,
  GetFeaturedJobsInteractorDependencies,
};
