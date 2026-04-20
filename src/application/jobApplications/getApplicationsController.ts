import { Request, Response, NextFunction } from 'express';
import { createGetApplicationsForJobInteractor } from '../../usecases/getApplicationsForJob/getApplicationsForJobInteractor';
import type { ControllerDependencies } from '../contextState';

const createGetApplicationsController = (deps: ControllerDependencies) => {
  const interactor = createGetApplicationsForJobInteractor(
    deps.applicationRepository,
  );

  const handleGetApplications = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const applications = await interactor.getApplicationsForJob(
        req.params.id,
      );
      res.json(applications);
    } catch (error) {
      next(error);
    }
  };

  return { handleGetApplications };
};

export { createGetApplicationsController };
