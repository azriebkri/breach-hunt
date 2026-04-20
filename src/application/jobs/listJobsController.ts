import { Request, Response, NextFunction } from 'express';
import { createListJobsInteractor } from '../../usecases/listJobs/listJobsInteractor';
import type { ControllerDependencies } from '../contextState';

const createListJobsController = (deps: ControllerDependencies) => {
  const interactor = createListJobsInteractor(deps.jobRepository);

  const handleListJobs = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const location =
        typeof req.query.location === 'string' ? req.query.location : undefined;
      const title =
        typeof req.query.title === 'string' ? req.query.title : undefined;

      const jobs = await interactor.getAllJobs({ location, title });
      res.json(jobs);
    } catch (error) {
      next(error);
    }
  };

  return { handleListJobs };
};

export { createListJobsController };
