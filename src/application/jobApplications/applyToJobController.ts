import { Request, Response, NextFunction } from 'express';
import { createApplyToJobInteractor } from '../../usecases/applyToJob/applyToJobInteractor';
import type { ControllerDependencies } from '../contextState';
import { createApplicationSchema } from './jobApplicationSchemas';

const createApplyToJobController = (deps: ControllerDependencies) => {
  const interactor = createApplyToJobInteractor({
    jobRepository: deps.jobRepository,
    applicationRepository: deps.applicationRepository,
    notificationGateway: deps.notificationGateway,
    idGenerator: deps.idGenerator,
    clock: deps.clock,
    logger: deps.logger,
    config: {
      notificationsEnabled: deps.config.notificationsEnabled,
      notificationRetries: deps.config.notificationRetries,
    },
  });

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
