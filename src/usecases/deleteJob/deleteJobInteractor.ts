import { createJobNotFoundError } from '../../entities/errors/jobNotFoundError';
import { AuditGateway } from '../../entities/gateways/auditGateway';
import { JobRepository } from '../../entities/gateways/jobRepository';
import { LoggerGateway } from '../../entities/gateways/logger';

interface DeleteJobInteractorDependencies {
  readonly jobRepository: JobRepository;
  readonly auditGateway: AuditGateway;
  readonly logger: LoggerGateway;
}

const createDeleteJobInteractor = (deps: DeleteJobInteractorDependencies) => {
  const removeJob = async (id: string): Promise<void> => {
    const removed = await deps.jobRepository.remove(id);

    if (!removed) {
      throw createJobNotFoundError(id);
    }

    try {
      await deps.auditGateway.publish('job.removed', { jobId: id });
    } catch (error) {
      deps.logger.warn('audit event publish failed', {
        activity: 'auditPublishFailed',
        jobId: id,
        reason: (error as Error).message,
      });
    }
  };

  return { removeJob };
};

export { createDeleteJobInteractor, DeleteJobInteractorDependencies };
