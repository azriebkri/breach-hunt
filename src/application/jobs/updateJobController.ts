import { Request, Response, NextFunction } from 'express';
import { createUpdateJobInteractor } from '../../usecases/updateJob/updateJobInteractor';
import type { ControllerDependencies } from '../contextState';
import { updateJobSchema } from './jobSchemas';

const createUpdateJobController = (deps: ControllerDependencies) => {
  const interactor = createUpdateJobInteractor({
    jobRepository: deps.jobRepository,
    auditGateway: deps.auditGateway,
    logger: deps.logger,
  });

  const handleUpdateJob = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const updates = updateJobSchema.parse(req.body);
      const job = await interactor.updateJob(req.params.id, updates);
      res.json(job);
    } catch (error) {
      next(error);
    }
  };

  return { handleUpdateJob };
};

export { createUpdateJobController };
