import { Request, Response, NextFunction } from 'express';
import { createGetFeaturedJobsInteractor } from '../../usecases/getFeaturedJobs/getFeaturedJobsInteractor';
import type { ControllerDependencies } from '../contextState';

const createGetFeaturedJobsController = (deps: ControllerDependencies) => {
  const interactor = createGetFeaturedJobsInteractor({
    jobRepository: deps.jobRepository,
    config: { highSalaryThreshold: deps.config.highSalaryThreshold },
  });

  const handleGetFeaturedJobs = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const featured = await interactor.getFeaturedJobs();
      res.json(featured);
    } catch (error) {
      next(error);
    }
  };

  return { handleGetFeaturedJobs };
};

export { createGetFeaturedJobsController };
