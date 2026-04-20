import { Request, Response, NextFunction } from 'express';
import { createGetJobsByCompanyInteractor } from '../../usecases/getJobsByCompany/getJobsByCompanyInteractor';
import type { ControllerDependencies } from '../contextState';

const createGetJobsByCompanyController = (deps: ControllerDependencies) => {
  const interactor = createGetJobsByCompanyInteractor(deps.jobRepository);

  const handleGetJobsByCompany = async (
    req: Request<{ company: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const jobs = await interactor.getJobsByCompany(req.params.company);
      res.json(jobs);
    } catch (error) {
      next(error);
    }
  };

  return { handleGetJobsByCompany };
};

export { createGetJobsByCompanyController };
