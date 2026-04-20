import { JobApplicationRepository } from '../entities/gateways/jobApplicationRepository';
import { NotificationGateway } from '../entities/gateways/notificationGateway';
import { InMemoryJobRepository } from '../infrastructure/jobs/inMemoryJobRepository';

interface ControllerDependencies {
  readonly jobRepository: InMemoryJobRepository;
  readonly applicationRepository: JobApplicationRepository;
  readonly notificationGateway: NotificationGateway;
}

export { ControllerDependencies };
