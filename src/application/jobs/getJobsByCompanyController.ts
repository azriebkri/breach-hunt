import { Request, Response, NextFunction } from 'express';
import type { ControllerDependencies } from '../contextState';

const createGetJobsByCompanyController = (deps: ControllerDependencies) => {
  const handleGetJobsByCompany = async (
    req: Request<{ company: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { company } = req.params;
      const allJobs = await deps.jobRepository.findAll();
      const filtered = allJobs.filter((job) => job.company === company);
      res.json(filtered);
    } catch (error) {
      next(error);
    }
  };

  return { handleGetJobsByCompany };
};

export { createGetJobsByCompanyController };
