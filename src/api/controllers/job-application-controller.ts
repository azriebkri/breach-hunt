import { Request, Response, NextFunction } from 'express';
import { CreateApplicationRequest } from '../schemas/job-schemas';
import { createJobApplicationService } from '../../application/services/job-application-service';
import { JobApplicationRepository } from '../../domain/ports/job-application-repository';
import { NotificationPort } from '../../domain/ports/notification-port';
import { InMemoryJobRepository } from '../../infrastructure/repositories/in-memory-job-repository';

const createJobApplicationController = (
  applicationRepository: JobApplicationRepository,
  notificationPort: NotificationPort,
  jobRepository: InMemoryJobRepository,
) => {
  const applicationService = createJobApplicationService(applicationRepository, notificationPort, jobRepository);

  const applyToJob = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as CreateApplicationRequest;
      const application = await applicationService.applyToJob(req.params.id, body);
      res.status(201).json(application);
    } catch (error) {
      next(error);
    }
  };

  const getApplications = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const applications = await applicationService.getApplicationsForJob(req.params.id);
      res.json(applications);
    } catch (error) {
      next(error);
    }
  };

  return {
    applyToJob,
    getApplications,
  };
};

export { createJobApplicationController };
