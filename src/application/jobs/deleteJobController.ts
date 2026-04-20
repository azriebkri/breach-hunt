import { Request, Response, NextFunction } from 'express';
import { createDeleteJobInteractor } from '../../usecases/deleteJob/deleteJobInteractor';
import type { ControllerDependencies } from '../contextState';

const createDeleteJobController = (deps: ControllerDependencies) => {
  const interactor = createDeleteJobInteractor(deps.jobRepository);

  const handleDeleteJob = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await interactor.removeJob(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  return { handleDeleteJob };
};

export { createDeleteJobController };
