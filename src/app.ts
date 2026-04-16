import express from 'express';
import { createRoutes } from './api/routes';
import { errorHandler } from './api/middleware/error-handler';
import { InMemoryJobRepository } from './infrastructure/repositories/in-memory-job-repository';
import { InMemoryJobApplicationRepository } from './infrastructure/repositories/in-memory-job-application-repository';
import { NotificationClient } from './infrastructure/external/notification-client';

const createApp = () => {
  const app = express();

  app.use(express.json());

  const jobRepository = new InMemoryJobRepository();
  const applicationRepository = new InMemoryJobApplicationRepository();
  const notificationPort = new NotificationClient();

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
