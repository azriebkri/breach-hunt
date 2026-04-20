import { JobRepository } from '../../entities/ports/jobRepository';
import { HttpError } from '../../application/middleware/errorHandlerMiddleware';
import { auditJobEvent } from '../auditJobEvent/auditJobEventInteractor';

const createDeleteJobInteractor = (jobRepository: JobRepository) => {
  const removeJob = async (id: string): Promise<void> => {
    const removed = await jobRepository.remove(id);

    if (!removed) {
      throw new HttpError(404, 'Job not found');
    }

    auditJobEvent('job.removed', { jobId: id }).catch(() => {
      // swallow audit failures so the main flow is not interrupted
    });
  };

  return { removeJob };
};

export { createDeleteJobInteractor };
