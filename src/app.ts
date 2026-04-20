import express from 'express';
import { createRoutes } from './api/routes';
import { errorHandler } from './api/middleware/error-handler';
import { createInMemoryJobRepository } from './infrastructure/repositories/in-memory-job-repository';
import { createInMemoryJobApplicationRepository } from './infrastructure/repositories/in-memory-job-application-repository';
import { createThrottledNotificationClient } from './infrastructure/external/throttled-notification-client';

const createApp = () => {
  const app = express();

  app.use(express.json());

  const jobRepository = createInMemoryJobRepository();
  const applicationRepository = createInMemoryJobApplicationRepository();
  const notificationPort = createThrottledNotificationClient();

  const routes = createRoutes({
    jobRepository,
    applicationRepository,
    notificationPort,
  });

  app.use('/api', routes);
  app.use(errorHandler);

  return app;
};

export { createApp };
