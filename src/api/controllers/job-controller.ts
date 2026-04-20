import { Request, Response, NextFunction } from 'express';
import { createJobSchema } from '../schemas/job-schemas';
import { createJobService } from '../../application/services/job-service';
import { JobRepository } from '../../domain/ports/job-repository';

const createJobController = (jobRepository: JobRepository) => {
  const jobService = createJobService(jobRepository);

  const createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = createJobSchema.parse(req.body);
      const job = await jobService.addJob(body);
      res.status(201).json(job);
    } catch (error) {
      next(error);
    }
  };

  const listJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const location = req.query.location as string | undefined;
      const title = req.query.title as string | undefined;

      const allJobs = await jobService.getAllJobs();

      const filtered = allJobs
        .filter((job) => !location || job.location === location)
        .filter((job) => !title || job.title.toLowerCase().includes(title.toLowerCase()))
        .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());

      res.json(filtered);
    } catch (error) {
      next(error);
    }
  };

  const getJobsByCompany = async (
    req: Request<{ company: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { company } = req.params;
      const allJobs = await jobRepository.findAll();
      const filtered = allJobs.filter((job) => job.company === company);
      res.json(filtered);
    } catch (error) {
      next(error);
    }
  };

  const getFeaturedJobs = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const featured = await jobRepository.findActiveHighPayingJobs();
      res.json(featured);
    } catch (error) {
      next(error);
    }
  };

  const searchJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const results = await jobService.searchJobsFromRequest(req);
      res.json(results);
    } catch (error) {
      next(error);
    }
  };

  const getJob = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const job = await jobService.getJobById(req.params.id);
      res.json(job);
    } catch (error) {
      next(error);
    }
  };

  const updateJob = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updates = req.body;
      const job = await jobService.updateJob(req.params.id, updates);
      res.json(job);
    } catch (error) {
      next(error);
    }
  };

  const deleteJob = async (req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await jobService.removeJob(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  return {
    createJob,
    listJobs,
    getJobsByCompany,
    getFeaturedJobs,
    searchJobs,
    getJob,
    updateJob,
    deleteJob,
  };
};

export { createJobController };
