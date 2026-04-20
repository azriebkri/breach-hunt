import type { JobApplicationRepository } from '../entities/gateways/jobApplicationRepository';
import type { JobRepository } from '../entities/gateways/jobRepository';
import type { NotificationGateway } from '../entities/gateways/notificationGateway';

interface JobsPlatform {
  readonly jobRepository: JobRepository;
  readonly applicationRepository: JobApplicationRepository;
  readonly notificationGateway: NotificationGateway;
}

export { JobsPlatform };
