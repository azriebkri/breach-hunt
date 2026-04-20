import { AuditGateway } from '../entities/gateways/auditGateway';
import { Clock } from '../entities/gateways/clock';
import { IdGenerator } from '../entities/gateways/idGenerator';
import { JobApplicationRepository } from '../entities/gateways/jobApplicationRepository';
import { JobRepository } from '../entities/gateways/jobRepository';
import { LoggerGateway } from '../entities/gateways/logger';
import { NotificationGateway } from '../entities/gateways/notificationGateway';

interface PlatformConfig {
  readonly maxSalary?: number;
  readonly highSalaryThreshold: number;
  readonly notificationsEnabled: boolean;
  readonly notificationRetries: number;
}

interface ControllerDependencies {
  readonly jobRepository: JobRepository;
  readonly applicationRepository: JobApplicationRepository;
  readonly notificationGateway: NotificationGateway;
  readonly auditGateway: AuditGateway;
  readonly clock: Clock;
  readonly idGenerator: IdGenerator;
  readonly logger: LoggerGateway;
  readonly config: PlatformConfig;
}

export { ControllerDependencies, PlatformConfig };
