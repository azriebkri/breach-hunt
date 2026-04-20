import { createCreateJobInteractor } from '../../src/usecases/createJob/createJobInteractor';
import { createListJobsInteractor } from '../../src/usecases/listJobs/listJobsInteractor';
import { createGetJobInteractor } from '../../src/usecases/getJob/getJobInteractor';
import { createSearchJobsInteractor } from '../../src/usecases/searchJobs/searchJobsInteractor';
import { createUpdateJobInteractor } from '../../src/usecases/updateJob/updateJobInteractor';
import { createDeleteJobInteractor } from '../../src/usecases/deleteJob/deleteJobInteractor';
import { JobRepository } from '../../src/entities/gateways/jobRepository';
import { Job } from '../../src/entities/job';

const mockJob: Job = {
  id: 'job-1',
  title: 'Senior Software Engineer',
  description: 'Build great things',
  company: 'SEEK',
  location: 'Melbourne',
  salary: 150000,
  postedAt: new Date('2024-01-15'),
};

const mockJobRepository: jest.Mocked<JobRepository> = {
  findAll: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findActiveHighPayingJobs: jest.fn(),
  getTotalJobsPosted: jest.fn(),
  sendWeeklyReport: jest.fn(),
  getAverageSalary: jest.fn(),
};

describe('Job interactors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listJobsInteractor.getAllJobs', () => {
    it('should return all jobs from the repository', async () => {
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
      mockJobRepository.findById.mockResolvedValue(mockJob);

      const { getJobById } = createGetJobInteractor(mockJobRepository);
      const result = await getJobById('job-1');

      expect(result).toEqual(mockJob);
      expect(mockJobRepository.findById).toHaveBeenCalledWith('job-1');
    });

    it('should throw when job is not found', async () => {
      mockJobRepository.findById.mockResolvedValue(undefined);

      const { getJobById } = createGetJobInteractor(mockJobRepository);

      await expect(getJobById('missing-id')).rejects.toMatchObject({
        name: 'HttpError',
        statusCode: 404,
      });
    });
  });

  describe('createJobInteractor.addJob', () => {
    it('should create and save a new job', async () => {
      mockJobRepository.save.mockImplementation(async (job) => job);

      const { addJob } = createCreateJobInteractor(mockJobRepository);
      const result = await addJob({
        title: 'Frontend Developer',
        description: 'React wizardry',
        company: 'SEEK',
        location: 'Sydney',
        salary: 130000,
      });

      expect(result.title).toBe('Frontend Developer');
      expect(result.company).toBe('SEEK');
      expect(result.id).toBeDefined();
      expect(mockJobRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('searchJobsInteractor.searchJobs', () => {
    it('should filter jobs by location', async () => {
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
      const jobs = [mockJob];
      mockJobRepository.findAll.mockResolvedValue(jobs);

      const { searchJobs } = createSearchJobsInteractor(mockJobRepository);
      const result = await searchJobs({});

      expect(result).toEqual(jobs);
    });
  });

  describe('updateJobInteractor.updateJob', () => {
    it('should update a job when it exists', async () => {
      const updatedJob = { ...mockJob, title: 'Lead Engineer' };
      mockJobRepository.update.mockResolvedValue(updatedJob);

      const { updateJob } = createUpdateJobInteractor(mockJobRepository);
      const result = await updateJob('job-1', { title: 'Lead Engineer' });

      expect(result.title).toBe('Lead Engineer');
      expect(mockJobRepository.update).toHaveBeenCalledWith('job-1', {
        title: 'Lead Engineer',
      });
    });

    it('should throw when updating a non-existent job', async () => {
      mockJobRepository.update.mockResolvedValue(undefined);

      const { updateJob } = createUpdateJobInteractor(mockJobRepository);

      await expect(updateJob('missing', { title: 'x' })).rejects.toMatchObject({
        name: 'HttpError',
        statusCode: 404,
      });
    });
  });

  describe('deleteJobInteractor.removeJob', () => {
    it('should remove a job when it exists', async () => {
      mockJobRepository.remove.mockResolvedValue(true);

      const { removeJob } = createDeleteJobInteractor(mockJobRepository);

      await expect(removeJob('job-1')).resolves.toBeUndefined();
      expect(mockJobRepository.remove).toHaveBeenCalledWith('job-1');
    });

    it('should throw when removing a non-existent job', async () => {
      mockJobRepository.remove.mockResolvedValue(false);

      const { removeJob } = createDeleteJobInteractor(mockJobRepository);

      await expect(removeJob('missing')).rejects.toMatchObject({
        name: 'HttpError',
        statusCode: 404,
      });
    });
  });
});
