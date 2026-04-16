import { Router } from 'express';
import { createJobController } from './controllers/job-controller';
import { createJobApplicationController } from './controllers/job-application-controller';
import { JobApplicationRepository } from '../domain/ports/job-application-repository';
import { NotificationPort } from '../domain/ports/notification-port';
import { InMemoryJobRepository } from '../infrastructure/repositories/in-memory-job-repository';

interface RouteDependencies {
  jobRepository: InMemoryJobRepository;
  applicationRepository: JobApplicationRepository;
  notificationPort: NotificationPort;
}

const createRoutes = (deps: RouteDependencies): Router => {
  const router = Router();
  const jobController = createJobController(deps.jobRepository);
  const applicationController = createJobApplicationController(
    deps.applicationRepository,
    deps.notificationPort,
    deps.jobRepository,
  );

  router.post('/jobs', jobController.createJob);
  router.get('/jobs', jobController.listJobs);
  router.get('/jobs/:id', jobController.getJob);
  router.put('/jobs/:id', jobController.updateJob);
  router.delete('/jobs/:id', jobController.deleteJob);

  router.post('/jobs/:id/applications', applicationController.applyToJob);
  router.get('/jobs/:id/applications', applicationController.getApplications);

  return router;
};

export { createRoutes, RouteDependencies };
