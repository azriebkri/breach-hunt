import { Router } from 'express';
import type { ControllerDependencies } from '../contextState';
import { createCreateJobController } from './createJobController';
import { createListJobsController } from './listJobsController';
import { createGetJobController } from './getJobController';
import { createUpdateJobController } from './updateJobController';
import { createDeleteJobController } from './deleteJobController';
import { createSearchJobsController } from './searchJobsController';
import { createGetFeaturedJobsController } from './getFeaturedJobsController';
import { createGetJobsByCompanyController } from './getJobsByCompanyController';

const createJobsRouter = (deps: ControllerDependencies): Router => {
  const router = Router();

  const { handleCreateJob } = createCreateJobController(deps);
  const { handleListJobs } = createListJobsController(deps);
  const { handleGetJob } = createGetJobController(deps);
  const { handleUpdateJob } = createUpdateJobController(deps);
  const { handleDeleteJob } = createDeleteJobController(deps);
  const { handleSearchJobs } = createSearchJobsController(deps);
  const { handleGetFeaturedJobs } = createGetFeaturedJobsController(deps);
  const { handleGetJobsByCompany } = createGetJobsByCompanyController(deps);

  router.post('/jobs', handleCreateJob);
  router.get('/jobs', handleListJobs);
  router.get('/jobs/search', handleSearchJobs);
  router.get('/jobs/featured', handleGetFeaturedJobs);
  router.get('/jobs/by-company/:company', handleGetJobsByCompany);
  router.get('/jobs/:id', handleGetJob);
  router.put('/jobs/:id', handleUpdateJob);
  router.delete('/jobs/:id', handleDeleteJob);

  return router;
};

export { createJobsRouter };
