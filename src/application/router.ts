import { Router } from 'express';
import type { ControllerDependencies } from './contextState';
import { createJobsRouter } from './jobs/jobsRouter';
import { createJobApplicationsRouter } from './jobApplications/jobApplicationsRouter';

const createRouter = (deps: ControllerDependencies): Router => {
  const router = Router();
  router.use(createJobsRouter(deps));
  router.use(createJobApplicationsRouter(deps));
  return router;
};

export { createRouter };
