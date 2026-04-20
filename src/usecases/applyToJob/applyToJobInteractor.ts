import { createApplicationFailedError } from '../../entities/errors/applicationFailedError';
import { Clock } from '../../entities/gateways/clock';
import { IdGenerator } from '../../entities/gateways/idGenerator';
import { JobApplicationRepository } from '../../entities/gateways/jobApplicationRepository';
import { JobRepository } from '../../entities/gateways/jobRepository';
import { LoggerGateway } from '../../entities/gateways/logger';
import { NotificationGateway } from '../../entities/gateways/notificationGateway';
import { JobApplication } from '../../entities/jobApplication';

interface CreateApplicationParams {
  applicantName: string;
  applicantEmail: string;
  coverLetter: string;
}

interface ApplyToJobConfig {
  readonly notificationsEnabled: boolean;
  readonly notificationRetries: number;
}

interface ApplyToJobInteractorDependencies {
  readonly jobRepository: JobRepository;
  readonly applicationRepository: JobApplicationRepository;
  readonly notificationGateway: NotificationGateway;
  readonly idGenerator: IdGenerator;
  readonly clock: Clock;
  readonly logger: LoggerGateway;
  readonly config: ApplyToJobConfig;
}

const createApplyToJobInteractor = (
  deps: ApplyToJobInteractorDependencies,
) => {
  const applyToJob = async (
    jobId: string,
    params: CreateApplicationParams,
  ): Promise<JobApplication> => {
    const job = await deps.jobRepository.findById(jobId);

    if (!job) {
      throw createApplicationFailedError(
        jobId,
        'The job posting does not exist',
      );
    }

    const application: JobApplication = {
      id: deps.idGenerator.next(),
      jobId,
      applicantName: params.applicantName,
      applicantEmail: params.applicantEmail,
      coverLetter: params.coverLetter,
      appliedAt: deps.clock.now(),
    };

    const saved = await deps.applicationRepository.save(application);

    if (!deps.config.notificationsEnabled) {
      return saved;
    }

    const message = `Your application for "${job.title}" at ${job.company} has been received.`;
    const retries = Math.max(1, deps.config.notificationRetries);

    let lastError: unknown;
    for (let attempt = 0; attempt < retries; attempt += 1) {
      try {
        await deps.notificationGateway.send(params.applicantEmail, message);
        return saved;
      } catch (error) {
        lastError = error;
        deps.logger.warn('notification attempt failed', {
          activity: 'notificationAttemptFailed',
          jobId,
          attempt: attempt + 1,
          reason: (error as Error).message,
        });
      }
    }

    deps.logger.error('notification retries exhausted', {
      activity: 'notificationRetriesExhausted',
      jobId,
      attempts: retries,
      reason: (lastError as Error | undefined)?.message,
    });

    return saved;
  };

  return { applyToJob };
};

export {
  createApplyToJobInteractor,
  CreateApplicationParams,
  ApplyToJobConfig,
  ApplyToJobInteractorDependencies,
};
