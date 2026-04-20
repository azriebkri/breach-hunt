import { Job } from '../../entities/job';
import { JobRepository } from '../../entities/gateways/jobRepository';
import { createHttpError } from '../../application/middleware/errorHandlerMiddleware';
import { auditJobEvent } from '../auditJobEvent/auditJobEventInteractor';

const createUpdateJobInteractor = (jobRepository: JobRepository) => {
  const updateJob = async (
    id: string,
    updates: Partial<Omit<Job, 'id' | 'postedAt'>>,
  ): Promise<Job> => {
    const updated = await jobRepository.update(id, updates);

    if (!updated) {
      throw createHttpError(404, 'Job not found');
    }

    auditJobEvent('job.updated', { jobId: updated.id }).catch(() => {
      // swallow audit failures so the main flow is not interrupted
    });

    return updated;
  };

  return { updateJob };
};

export { createUpdateJobInteractor };
