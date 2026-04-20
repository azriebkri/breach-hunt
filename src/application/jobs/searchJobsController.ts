import { Request, Response, NextFunction } from 'express';
import { createSearchJobsInteractor } from '../../usecases/searchJobs/searchJobsInteractor';
import type { ControllerDependencies } from '../contextState';

const createSearchJobsController = (deps: ControllerDependencies) => {
  const interactor = createSearchJobsInteractor(deps.jobRepository);

  const handleSearchJobs = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const results = await interactor.searchJobsFromRequest(req);
      res.json(results);
    } catch (error) {
      next(error);
    }
  };

  return { handleSearchJobs };
};

export { createSearchJobsController };
