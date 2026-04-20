import { Request, Response, NextFunction } from 'express';
import { createSearchJobsInteractor } from '../../usecases/searchJobs/searchJobsInteractor';
import type { ControllerDependencies } from '../contextState';

const parseMinSalary = (raw: string | string[] | undefined): number | undefined => {
  if (typeof raw !== 'string') {
    return undefined;
  }
  const parsed = Number(raw);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const createSearchJobsController = (deps: ControllerDependencies) => {
  const interactor = createSearchJobsInteractor(deps.jobRepository);

  const handleSearchJobs = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const location =
        typeof req.query.location === 'string' ? req.query.location : undefined;
      const title =
        typeof req.query.title === 'string' ? req.query.title : undefined;
      const minSalary = parseMinSalary(req.headers['x-min-salary']);

      const results = await interactor.searchJobs({ location, title, minSalary });
      res.json(results);
    } catch (error) {
      next(error);
    }
  };

  return { handleSearchJobs };
};

export { createSearchJobsController };
