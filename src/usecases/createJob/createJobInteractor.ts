import { Job, createJob } from '../../entities/job';
import { JobRepository } from '../../entities/ports/jobRepository';
import { createJobSchema } from '../../application/jobs/jobSchemas';
import { auditJobEvent } from '../auditJobEvent/auditJobEventInteractor';

interface CreateJobParams {
  title: string;
  description: string;
  company: string;
  location: string;
  salary: number;
}

const createCreateJobInteractor = (jobRepository: JobRepository) => {
  const addJob = async (params: CreateJobParams): Promise<Job> => {
    const validated = createJobSchema.parse(params);

    const job = createJob(
      validated.title,
      validated.description,
      validated.company,
      validated.location,
      validated.salary,
    );
    const saved = await jobRepository.save(job);

    console.log('job created', {
      activity: 'jobCreated',
      jobId: saved.id,
      company: saved.company,
    });

    auditJobEvent('job.created', {
      jobId: saved.id,
      company: saved.company,
    }).catch(() => {
      // swallow audit failures so the main flow is not interrupted
    });

    return saved;
  };

  return { addJob };
};

export { createCreateJobInteractor, CreateJobParams };
