import { Request, Response, NextFunction } from 'express';
import { CreateApplicationRequest } from './jobApplicationSchemas';
import { createApplyToJobInteractor } from '../../usecases/applyToJob/applyToJobInteractor';
import type { ControllerDependencies } from '../contextState';

const createApplyToJobController = (deps: ControllerDependencies) => {
  const interactor = createApplyToJobInteractor(
    deps.applicationRepository,
    deps.notificationPort,
    deps.jobRepository,
  );

  const handleApplyToJob = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const body = req.body as CreateApplicationRequest;
      const application = await interactor.applyToJob(req.params.id, body);
      res.status(201).json(application);
    } catch (error) {
      next(error);
    }
  };

  return { handleApplyToJob };
};

export { createApplyToJobController };
