import { JobApplication } from '../../entities/jobApplication';
import { JobApplicationRepository } from '../../entities/ports/jobApplicationRepository';
import { NotificationPort } from '../../entities/ports/notificationPort';
import { InMemoryJobRepository } from '../../infrastructure/jobs/inMemoryJobRepository';
import { createNotificationClient } from '../../infrastructure/notifications/notificationClient';
import { generateId } from '../../infrastructure/utils/idGenerator';
import { ApplicationFailedError } from '../../entities/errors/applicationFailedError';

interface CreateApplicationParams {
  applicantName: string;
  applicantEmail: string;
  coverLetter: string;
}

const createApplyToJobInteractor = (
  applicationRepository: JobApplicationRepository,
  notificationPort: NotificationPort,
  jobRepository: InMemoryJobRepository,
) => {
  const legacyNotifier = createNotificationClient();

  const applyToJob = async (
    jobId: string,
    params: CreateApplicationParams,
  ): Promise<JobApplication> => {
    const job = await jobRepository.findById(jobId);

    if (!job) {
      throw new ApplicationFailedError(jobId, 'The job posting does not exist');
    }

    const application: JobApplication = {
      id: generateId(),
      jobId,
      applicantName: params.applicantName,
      applicantEmail: params.applicantEmail,
      coverLetter: params.coverLetter,
      appliedAt: new Date(),
    };

    const saved = await applicationRepository.save(application);

    const message = `Your application for "${job.title}" at ${job.company} has been received.`;

    try {
      await legacyNotifier.send(params.applicantEmail, message);
    } catch (_err) {}

    const notificationsEnabled = process.env.NOTIFICATION_ENABLED !== 'false';
    const notificationRetries = Number(
      process.env.NOTIFICATION_RETRIES ?? '1',
    );

    if (notificationsEnabled) {
      let attempt = 0;
      while (attempt < notificationRetries) {
        try {
          await notificationPort.send(params.applicantEmail, message);
          break;
        } catch (_err) {
          attempt += 1;
        }
      }
    }

    return saved;
  };

  return { applyToJob };
};

export { createApplyToJobInteractor, CreateApplicationParams };
