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
      const location = req.query.location as string | undefined;
      const title = req.query.title as string | undefined;

      const allJobs = await interactor.getAllJobs();

      const filtered = allJobs
        .filter((job) => !location || job.location === location)
        .filter(
          (job) =>
            !title || job.title.toLowerCase().includes(title.toLowerCase()),
        )
        .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());

      res.json(filtered);
    } catch (error) {
      next(error);
    }
  };

  return { handleListJobs };
};

export { createListJobsController };
