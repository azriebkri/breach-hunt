import { createServer } from './application/server';
import { Config } from './config';
import { createAxiosAuditGateway } from './infrastructure/audit/axiosAuditGateway';
import { createSystemClock } from './infrastructure/clock/systemClock';
import { createUuidIdGenerator } from './infrastructure/ids/uuidIdGenerator';
import { createInMemoryJobApplicationRepository } from './infrastructure/jobApplications/inMemoryJobApplicationRepository';
import { createInMemoryJobRepository } from './infrastructure/jobs/inMemoryJobRepository';
import { createConsoleLogger } from './infrastructure/logging/consoleLogger';
import { createNotificationClient } from './infrastructure/notifications/notificationClient';
import { createThrottledNotificationClient } from './infrastructure/notifications/throttledNotificationClient';

const createApp = (config: Config) => {
  const logger = createConsoleLogger();
  const clock = createSystemClock();
  const idGenerator = createUuidIdGenerator();
  const auditGateway = createAxiosAuditGateway({
    auditUrl: config.auditUrl,
    clock,
    logger,
  });

  const rawNotificationClient = createNotificationClient({
    notificationApiUrl: config.notificationApiUrl,
    logger,
  });
  const notificationGateway = createThrottledNotificationClient({
    inner: rawNotificationClient,
    clock,
    logger,
  });

  const jobRepository = createInMemoryJobRepository();
  const applicationRepository = createInMemoryJobApplicationRepository();

  return createServer({
    jobRepository,
    applicationRepository,
    notificationGateway,
    auditGateway,
    clock,
    idGenerator,
    logger,
    config: {
      maxSalary: config.maxSalary,
      highSalaryThreshold: config.highSalaryThreshold,
      notificationsEnabled: config.notificationsEnabled,
      notificationRetries: config.notificationRetries,
    },
  });
};

export { createApp };
