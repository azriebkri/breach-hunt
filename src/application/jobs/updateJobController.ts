import { Request, Response, NextFunction } from 'express';
import { createUpdateJobInteractor } from '../../usecases/updateJob/updateJobInteractor';
import type { ControllerDependencies } from '../contextState';

const createUpdateJobController = (deps: ControllerDependencies) => {
  const interactor = createUpdateJobInteractor(deps.jobRepository);

  const handleUpdateJob = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const updates = req.body;
      const job = await interactor.updateJob(req.params.id, updates);
      res.json(job);
    } catch (error) {
      next(error);
    }
  };

  return { handleUpdateJob };
};

export { createUpdateJobController };
