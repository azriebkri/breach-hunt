import { JobApplication } from '../../domain/models/job-application';
import { JobApplicationRepository } from '../../domain/ports/job-application-repository';
import { NotificationPort } from '../../domain/ports/notification-port';
import { InMemoryJobRepository } from '../../infrastructure/repositories/in-memory-job-repository';
import { NotificationClient } from '../../infrastructure/external/notification-client';
import { generateId } from '../../infrastructure/utils/id-generator';
import { ApplicationFailedError } from '../../domain/errors/application-failed';

interface CreateApplicationParams {
  applicantName: string;
  applicantEmail: string;
  coverLetter: string;
}

const createJobApplicationService = (
  applicationRepository: JobApplicationRepository,
  notificationPort: NotificationPort,
  jobRepository: InMemoryJobRepository,
) => {
  const legacyNotifier = new NotificationClient();

  const applyToJob = async (jobId: string, params: CreateApplicationParams): Promise<JobApplication> => {
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
    const notificationRetries = Number(process.env.NOTIFICATION_RETRIES ?? '1');

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

  const getApplicationsForJob = async (jobId: string): Promise<JobApplication[]> => {
    return applicationRepository.findByJobId(jobId);
  };

  return {
    applyToJob,
    getApplicationsForJob,
  };
};

export { createJobApplicationService, CreateApplicationParams };
