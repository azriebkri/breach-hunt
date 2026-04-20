import { AuditGateway } from '../../entities/gateways/auditGateway';
import { Clock } from '../../entities/gateways/clock';
import { IdGenerator } from '../../entities/gateways/idGenerator';
import { JobRepository } from '../../entities/gateways/jobRepository';
import { LoggerGateway } from '../../entities/gateways/logger';
import { Job, createJob } from '../../entities/job';

interface CreateJobParams {
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number;
}

interface CreateJobConfig {
  readonly maxSalary?: number;
}

interface CreateJobInteractorDependencies {
  readonly jobRepository: JobRepository;
  readonly idGenerator: IdGenerator;
  readonly clock: Clock;
  readonly logger: LoggerGateway;
  readonly auditGateway: AuditGateway;
  readonly config: CreateJobConfig;
}

const createCreateJobInteractor = (
  deps: CreateJobInteractorDependencies,
) => {
  const addJob = async (params: CreateJobParams): Promise<Job> => {
    const job = createJob({
      id: deps.idGenerator.next(),
      postedAt: deps.clock.now(),
      maxSalary: deps.config.maxSalary,
      title: params.title,
      description: params.description,
      company: params.company,
      location: params.location,
      salary: params.salary,
    });

    const saved = await deps.jobRepository.save(job);

    deps.logger.info('job created', {
      activity: 'jobCreated',
      jobId: saved.id,
      company: saved.company,
    });

    try {
      await deps.auditGateway.publish('job.created', {
        jobId: saved.id,
        company: saved.company,
      });
    } catch (error) {
      deps.logger.warn('audit event publish failed', {
        activity: 'auditPublishFailed',
        jobId: saved.id,
        reason: (error as Error).message,
      });
    }

    return saved;
  };

  return { addJob };
};

export {
  createCreateJobInteractor,
  CreateJobParams,
  CreateJobConfig,
  CreateJobInteractorDependencies,
};
