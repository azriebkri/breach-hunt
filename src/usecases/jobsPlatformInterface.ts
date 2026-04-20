import type { JobApplicationRepository } from '../entities/ports/jobApplicationRepository';
import type { JobRepository } from '../entities/ports/jobRepository';
import type { NotificationPort } from '../entities/ports/notificationPort';

interface JobsPlatform {
  readonly jobRepository: JobRepository;
  readonly applicationRepository: JobApplicationRepository;
  readonly notificationPort: NotificationPort;
}

export { JobsPlatform };
