import { createServer } from './application/server';
import { createInMemoryJobRepository } from './infrastructure/jobs/inMemoryJobRepository';
import { createInMemoryJobApplicationRepository } from './infrastructure/jobApplications/inMemoryJobApplicationRepository';
import { createThrottledNotificationClient } from './infrastructure/notifications/throttledNotificationClient';

const createApp = () => {
  const jobRepository = createInMemoryJobRepository();
  const applicationRepository = createInMemoryJobApplicationRepository();
  const notificationPort = createThrottledNotificationClient();

  return createServer({
    jobRepository,
    applicationRepository,
    notificationPort,
  });
};

export { createApp };
