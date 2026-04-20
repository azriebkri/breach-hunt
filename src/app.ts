import { createServer } from './application/server';
import { createInMemoryJobApplicationRepository } from './infrastructure/jobApplications/inMemoryJobApplicationRepository';
import { createInMemoryJobRepository } from './infrastructure/jobs/inMemoryJobRepository';
import { createThrottledNotificationClient } from './infrastructure/notifications/throttledNotificationClient';

const createApp = () => {
  const jobRepository = createInMemoryJobRepository();
  const applicationRepository = createInMemoryJobApplicationRepository();
  const notificationGateway = createThrottledNotificationClient();

  return createServer({
    jobRepository,
    applicationRepository,
    notificationGateway,
  });
};

export { createApp };
