import { Request, Response, NextFunction } from 'express';
import type { ControllerDependencies } from '../contextState';

const createGetFeaturedJobsController = (deps: ControllerDependencies) => {
  const handleGetFeaturedJobs = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const featured = await deps.jobRepository.findActiveHighPayingJobs();
      res.json(featured);
    } catch (error) {
      next(error);
    }
  };

  return { handleGetFeaturedJobs };
};

export { createGetFeaturedJobsController };
