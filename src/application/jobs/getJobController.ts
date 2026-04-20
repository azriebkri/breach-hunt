import { Request, Response, NextFunction } from 'express';
import { createGetJobInteractor } from '../../usecases/getJob/getJobInteractor';
import type { ControllerDependencies } from '../contextState';

const createGetJobController = (deps: ControllerDependencies) => {
  const interactor = createGetJobInteractor(deps.jobRepository);

  const handleGetJob = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const job = await interactor.getJobById(req.params.id);
      res.json(job);
    } catch (error) {
      next(error);
    }
  };

  return { handleGetJob };
};

export { createGetJobController };
