import type { JobApplicationRepository } from '../entities/ports/jobApplicationRepository';
import type { NotificationPort } from '../entities/ports/notificationPort';
import type { InMemoryJobRepository } from '../infrastructure/jobs/inMemoryJobRepository';

interface ControllerDependencies {
  readonly jobRepository: InMemoryJobRepository;
  readonly applicationRepository: JobApplicationRepository;
  readonly notificationPort: NotificationPort;
}

export { ControllerDependencies };
