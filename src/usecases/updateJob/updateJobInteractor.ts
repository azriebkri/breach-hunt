import { createJobNotFoundError } from '../../entities/errors/jobNotFoundError';
import { AuditGateway } from '../../entities/gateways/auditGateway';
import { JobRepository } from '../../entities/gateways/jobRepository';
import { LoggerGateway } from '../../entities/gateways/logger';
import { Job } from '../../entities/job';

interface UpdateJobInteractorDependencies {
  readonly jobRepository: JobRepository;
  readonly auditGateway: AuditGateway;
  readonly logger: LoggerGateway;
}

const createUpdateJobInteractor = (deps: UpdateJobInteractorDependencies) => {
  const updateJob = async (
    id: string,
    updates: Partial<Omit<Job, 'id' | 'postedAt'>>,
  ): Promise<Job> => {
    const updated = await deps.jobRepository.update(id, updates);

    if (!updated) {
      throw createJobNotFoundError(id);
    }

    try {
      await deps.auditGateway.publish('job.updated', { jobId: updated.id });
    } catch (error) {
      deps.logger.warn('audit event publish failed', {
        activity: 'auditPublishFailed',
        jobId: updated.id,
        reason: (error as Error).message,
      });
    }

    return updated;
  };

  return { updateJob };
};

export { createUpdateJobInteractor, UpdateJobInteractorDependencies };
