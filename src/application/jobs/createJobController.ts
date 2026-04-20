import { Request, Response, NextFunction } from 'express';
import { createJobSchema } from './jobSchemas';
import { createCreateJobInteractor } from '../../usecases/createJob/createJobInteractor';
import type { ControllerDependencies } from '../contextState';

const createCreateJobController = (deps: ControllerDependencies) => {
  const interactor = createCreateJobInteractor(deps.jobRepository);

  const handleCreateJob = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const body = createJobSchema.parse(req.body);
      const job = await interactor.addJob(body);
      res.status(201).json(job);
    } catch (error) {
      next(error);
    }
  };

  return { handleCreateJob };
};

export { createCreateJobController };
