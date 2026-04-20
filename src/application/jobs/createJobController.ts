import { Request, Response, NextFunction } from 'express';
import { createCreateJobInteractor } from '../../usecases/createJob/createJobInteractor';
import type { ControllerDependencies } from '../contextState';
import { createJobSchema } from './jobSchemas';

const createCreateJobController = (deps: ControllerDependencies) => {
  const interactor = createCreateJobInteractor({
    jobRepository: deps.jobRepository,
    idGenerator: deps.idGenerator,
    clock: deps.clock,
    logger: deps.logger,
    auditGateway: deps.auditGateway,
    config: { maxSalary: deps.config.maxSalary },
  });

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
