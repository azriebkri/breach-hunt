import { AuditGateway } from '../../src/entities/gateways/auditGateway';
import { Clock } from '../../src/entities/gateways/clock';
import { IdGenerator } from '../../src/entities/gateways/idGenerator';
import { JobRepository } from '../../src/entities/gateways/jobRepository';
import { LoggerGateway } from '../../src/entities/gateways/logger';
import { Job } from '../../src/entities/job';
import { createCreateJobInteractor } from '../../src/usecases/createJob/createJobInteractor';
import { createDeleteJobInteractor } from '../../src/usecases/deleteJob/deleteJobInteractor';
import { createGetJobInteractor } from '../../src/usecases/getJob/getJobInteractor';
import { createListJobsInteractor } from '../../src/usecases/listJobs/listJobsInteractor';
import { createSearchJobsInteractor } from '../../src/usecases/searchJobs/searchJobsInteractor';
import { createUpdateJobInteractor } from '../../src/usecases/updateJob/updateJobInteractor';

const mockJob: Job = {
  id: 'job-1',
  title: 'Senior Software Engineer',
  description: 'Build great things',
  company: 'SEEK',
  location: 'Melbourne',
  salary: 150000,
  postedAt: new Date('2024-01-15'),
};

const createMockJobRepository = (): jest.Mocked<JobRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

const createMockLogger = (): jest.Mocked<LoggerGateway> => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
});

const createMockAuditGateway = (): jest.Mocked<AuditGateway> => ({
  publish: jest.fn().mockResolvedValue(undefined),
});

const createMockClock = (fixedDate = new Date('2024-06-01T00:00:00Z')): jest.Mocked<Clock> => ({
  now: jest.fn().mockReturnValue(fixedDate),
});

const createMockIdGenerator = (id = 'generated-id'): jest.Mocked<IdGenerator> => ({
  next: jest.fn().mockReturnValue(id),
});

describe('Job interactors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listJobsInteractor.getAllJobs', () => {
    it('should return all jobs from the repository', async () => {
      const mockJobRepository = createMockJobRepository();
      const jobs = [mockJob];
      mockJobRepository.findAll.mockResolvedValue(jobs);

      const { getAllJobs } = createListJobsInteractor(mockJobRepository);
      const result = await getAllJobs();

      expect(result).toEqual(jobs);
      expect(mockJobRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getJobInteractor.getJobById', () => {
    it('should return a job when it exists', async () => {
      const mockJobRepository = createMockJobRepository();
      mockJobRepository.findById.mockResolvedValue(mockJob);

      const { getJobById } = createGetJobInteractor(mockJobRepository);
      const result = await getJobById('job-1');

      expect(result).toEqual(mockJob);
      expect(mockJobRepository.findById).toHaveBeenCalledWith('job-1');
    });

    it('should throw JobNotFoundError when job is not found', async () => {
      const mockJobRepository = createMockJobRepository();
      mockJobRepository.findById.mockResolvedValue(undefined);

      const { getJobById } = createGetJobInteractor(mockJobRepository);

      await expect(getJobById('missing-id')).rejects.toMatchObject({
        name: 'JobNotFoundError',
        jobId: 'missing-id',
      });
    });
  });

  describe('createJobInteractor.addJob', () => {
    it('should create and save a new job', async () => {
      const mockJobRepository = createMockJobRepository();
      mockJobRepository.save.mockImplementation(async (job) => job);

      const { addJob } = createCreateJobInteractor({
        jobRepository: mockJobRepository,
        idGenerator: createMockIdGenerator('job-42'),
        clock: createMockClock(),
        logger: createMockLogger(),
        auditGateway: createMockAuditGateway(),
        config: {},
      });

      const result = await addJob({
        title: 'Frontend Developer',
        description: 'React wizardry',
        company: 'SEEK',
        location: 'Sydney',
        salary: 130000,
      });

      expect(result.title).toBe('Frontend Developer');
      expect(result.company).toBe('SEEK');
      expect(result.id).toBe('job-42');
      expect(mockJobRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should reject when salary exceeds configured maximum', async () => {
      const mockJobRepository = createMockJobRepository();

      const { addJob } = createCreateJobInteractor({
        jobRepository: mockJobRepository,
        idGenerator: createMockIdGenerator(),
        clock: createMockClock(),
        logger: createMockLogger(),
        auditGateway: createMockAuditGateway(),
        config: { maxSalary: 100000 },
      });

      await expect(
        addJob({
          title: 'Overpriced',
          description: 'x',
          company: 'SEEK',
          location: 'Melbourne',
          salary: 200000,
        }),
      ).rejects.toMatchObject({ name: 'SalaryLimitExceededError' });
      expect(mockJobRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('searchJobsInteractor.searchJobs', () => {
    it('should filter jobs by location', async () => {
      const mockJobRepository = createMockJobRepository();
      const jobs: Job[] = [
        { ...mockJob, id: '1', location: 'Melbourne' },
        { ...mockJob, id: '2', location: 'Sydney' },
      ];
      mockJobRepository.findAll.mockResolvedValue(jobs);

      const { searchJobs } = createSearchJobsInteractor(mockJobRepository);
      const result = await searchJobs({ location: 'Melbourne' });

      expect(result).toHaveLength(1);
      expect(result[0].location).toBe('Melbourne');
    });

    it('should filter jobs by title', async () => {
      const mockJobRepository = createMockJobRepository();
      const jobs: Job[] = [
        { ...mockJob, id: '1', title: 'Senior Software Engineer' },
        { ...mockJob, id: '2', title: 'Product Manager' },
      ];
      mockJobRepository.findAll.mockResolvedValue(jobs);

      const { searchJobs } = createSearchJobsInteractor(mockJobRepository);
      const result = await searchJobs({ title: 'engineer' });

      expect(result).toHaveLength(1);
      expect(result[0].title).toContain('Engineer');
    });

    it('should return all jobs when no filters are provided', async () => {
      const mockJobRepository = createMockJobRepository();
      const jobs = [mockJob];
      mockJobRepository.findAll.mockResolvedValue(jobs);

      const { searchJobs } = createSearchJobsInteractor(mockJobRepository);
      const result = await searchJobs({});

      expect(result).toEqual(jobs);
    });
  });

  describe('updateJobInteractor.updateJob', () => {
    it('should update a job when it exists', async () => {
      const mockJobRepository = createMockJobRepository();
      const updatedJob = { ...mockJob, title: 'Lead Engineer' };
      mockJobRepository.update.mockResolvedValue(updatedJob);

      const { updateJob } = createUpdateJobInteractor({
        jobRepository: mockJobRepository,
        auditGateway: createMockAuditGateway(),
        logger: createMockLogger(),
      });
      const result = await updateJob('job-1', { title: 'Lead Engineer' });

      expect(result.title).toBe('Lead Engineer');
      expect(mockJobRepository.update).toHaveBeenCalledWith('job-1', {
        title: 'Lead Engineer',
      });
    });

    it('should throw JobNotFoundError when updating a non-existent job', async () => {
      const mockJobRepository = createMockJobRepository();
      mockJobRepository.update.mockResolvedValue(undefined);

      const { updateJob } = createUpdateJobInteractor({
        jobRepository: mockJobRepository,
        auditGateway: createMockAuditGateway(),
        logger: createMockLogger(),
      });

      await expect(updateJob('missing', { title: 'x' })).rejects.toMatchObject({
        name: 'JobNotFoundError',
        jobId: 'missing',
      });
    });
  });

  describe('deleteJobInteractor.removeJob', () => {
    it('should remove a job when it exists', async () => {
      const mockJobRepository = createMockJobRepository();
      mockJobRepository.remove.mockResolvedValue(true);

      const { removeJob } = createDeleteJobInteractor({
        jobRepository: mockJobRepository,
        auditGateway: createMockAuditGateway(),
        logger: createMockLogger(),
      });

      await expect(removeJob('job-1')).resolves.toBeUndefined();
      expect(mockJobRepository.remove).toHaveBeenCalledWith('job-1');
    });

    it('should throw JobNotFoundError when removing a non-existent job', async () => {
      const mockJobRepository = createMockJobRepository();
      mockJobRepository.remove.mockResolvedValue(false);

      const { removeJob } = createDeleteJobInteractor({
        jobRepository: mockJobRepository,
        auditGateway: createMockAuditGateway(),
        logger: createMockLogger(),
      });

      await expect(removeJob('missing')).rejects.toMatchObject({
        name: 'JobNotFoundError',
        jobId: 'missing',
      });
    });
  });
});
