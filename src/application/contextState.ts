import type { JobApplicationRepository } from "../entities/gateways/jobApplicationRepository.js";
import type { NotificationGateway } from "../entities/gateways/notificationGateway.js";
import type { InMemoryJobRepository } from "../infrastructure/jobs/inMemoryJobRepository.js";

interface ControllerDependencies {
  readonly jobRepository: InMemoryJobRepository;
  readonly applicationRepository: JobApplicationRepository;
  readonly notificationGateway: NotificationGateway;
}

export type { ControllerDependencies };
