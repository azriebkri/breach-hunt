import { Request, Response, NextFunction } from 'express';
import { createApplicationSchema } from './jobApplicationSchemas';
import { createApplyToJobInteractor } from '../../usecases/applyToJob/applyToJobInteractor';
import type { ControllerDependencies } from '../contextState';

const createApplyToJobController = (deps: ControllerDependencies) => {
  const interactor = createApplyToJobInteractor(
    deps.applicationRepository,
    deps.notificationGateway,
    deps.jobRepository,
  );

  const handleApplyToJob = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const body = createApplicationSchema.parse(req.body);
      const application = await interactor.applyToJob(req.params.id, body);
      res.status(201).json(application);
    } catch (error) {
      next(error);
    }
  };

  return { handleApplyToJob };
};

export { createApplyToJobController };
