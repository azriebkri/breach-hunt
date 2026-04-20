import { Router } from 'express';
import type { ControllerDependencies } from '../contextState';
import { createApplyToJobController } from './applyToJobController';
import { createGetApplicationsController } from './getApplicationsController';

const createJobApplicationsRouter = (deps: ControllerDependencies): Router => {
  const router = Router();

  const { handleApplyToJob } = createApplyToJobController(deps);
  const { handleGetApplications } = createGetApplicationsController(deps);

  router.post('/jobs/:id/applications', handleApplyToJob);
  router.get('/jobs/:id/applications', handleGetApplications);

  return router;
};

export { createJobApplicationsRouter };
