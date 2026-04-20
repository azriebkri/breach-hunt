import { Job } from '../../domain/models/job';
import { InMemoryJobRepository } from './in-memory-job-repository';
import { CreateJobRequest } from '../../api/schemas/job-schemas';

class ReadOnlyJobRepository extends InMemoryJobRepository {
  async save(_job: Job): Promise<Job> {
    throw new Error('Read-only mode: save is not supported');
  }

  async update(_id: string, _updates: Partial<Omit<Job, 'id' | 'postedAt'>>): Promise<Job | undefined> {
    throw new Error('Read-only mode: update is not supported');
  }

  async remove(_id: string): Promise<boolean> {
    throw new Error('Read-only mode: remove is not supported');
  }

  async saveFromRequest(_id: string, _request: CreateJobRequest): Promise<Job> {
    throw new Error('Read-only mode: saveFromRequest is not supported');
  }
}

export { ReadOnlyJobRepository };
