import { Request, Response, NextFunction } from 'express';
import type { ControllerDependencies } from '../contextState';

const createGetApplicationsController = (deps: ControllerDependencies) => {
  const handleGetApplications = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const applications = await deps.applicationRepository.findByJobId(
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
