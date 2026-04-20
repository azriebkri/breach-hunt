import { Router } from 'express';
import { AuditGateway } from '../entities/gateways/auditGateway';
import { Clock } from '../entities/gateways/clock';
import { IdGenerator } from '../entities/gateways/idGenerator';
import { JobApplicationRepository } from '../entities/gateways/jobApplicationRepository';
import { JobRepository } from '../entities/gateways/jobRepository';
import { LoggerGateway } from '../entities/gateways/logger';
import { NotificationGateway } from '../entities/gateways/notificationGateway';
import { createNoopAuditGateway } from '../infrastructure/audit/noopAuditGateway';
import { createSystemClock } from '../infrastructure/clock/systemClock';
import { createUuidIdGenerator } from '../infrastructure/ids/uuidIdGenerator';
import { createConsoleLogger } from '../infrastructure/logging/consoleLogger';
import type {
  ControllerDependencies,
  PlatformConfig,
} from './contextState';
import { createJobApplicationsRouter } from './jobApplications/jobApplicationsRouter';
import { createJobsRouter } from './jobs/jobsRouter';

interface RouterDependencies {
  readonly jobRepository: JobRepository;
  readonly applicationRepository: JobApplicationRepository;
  readonly notificationGateway: NotificationGateway;
  readonly auditGateway?: AuditGateway;
  readonly clock?: Clock;
  readonly idGenerator?: IdGenerator;
  readonly logger?: LoggerGateway;
  readonly config?: Partial<PlatformConfig>;
}

const DEFAULT_HIGH_SALARY_THRESHOLD = 100000;

const resolveConfig = (overrides?: Partial<PlatformConfig>): PlatformConfig => ({
  maxSalary: overrides?.maxSalary,
  highSalaryThreshold:
    overrides?.highSalaryThreshold ?? DEFAULT_HIGH_SALARY_THRESHOLD,
  notificationsEnabled: overrides?.notificationsEnabled ?? true,
  notificationRetries: overrides?.notificationRetries ?? 1,
});

const buildControllerDependencies = (
  input: RouterDependencies,
): ControllerDependencies => {
  const logger = input.logger ?? createConsoleLogger();
  const clock = input.clock ?? createSystemClock();

  return {
    jobRepository: input.jobRepository,
    applicationRepository: input.applicationRepository,
    notificationGateway: input.notificationGateway,
    auditGateway: input.auditGateway ?? createNoopAuditGateway(),
    clock,
    idGenerator: input.idGenerator ?? createUuidIdGenerator(),
    logger,
    config: resolveConfig(input.config),
  };
};

const createRouter = (input: RouterDependencies): Router => {
  const deps = buildControllerDependencies(input);
  const router = Router();
  router.use(createJobsRouter(deps));
  router.use(createJobApplicationsRouter(deps));
  return router;
};

export { createRouter, RouterDependencies };
