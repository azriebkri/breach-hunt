import { createServer } from "./application/server.js";
import { createInMemoryJobApplicationRepository } from "./infrastructure/jobApplications/inMemoryJobApplicationRepository.js";
import { createInMemoryJobRepository } from "./infrastructure/jobs/inMemoryJobRepository.js";
import { createThrottledNotificationClient } from "./infrastructure/notifications/throttledNotificationClient.js";

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
