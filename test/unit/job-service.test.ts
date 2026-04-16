import { createJobService } from '../../src/application/services/job-service';
import { JobRepository } from '../../src/domain/ports/job-repository';
import { Job } from '../../src/domain/models/job';
import { HttpError } from '../../src/api/middleware/error-handler';

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
};

describe('JobService', () => {
  let jobService: ReturnType<typeof createJobService>;

  beforeEach(() => {
    jest.clearAllMocks();
    jobService = createJobService(mockJobRepository);
  });

  describe('getAllJobs', () => {
    it('should return all jobs from the repository', async () => {
      const jobs = [mockJob];
      mockJobRepository.findAll.mockResolvedValue(jobs);

      const result = await jobService.getAllJobs();

      expect(result).toEqual(jobs);
      expect(mockJobRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getJobById', () => {
    it('should return a job when it exists', async () => {
      mockJobRepository.findById.mockResolvedValue(mockJob);

      const result = await jobService.getJobById('job-1');

      expect(result).toEqual(mockJob);
      expect(mockJobRepository.findById).toHaveBeenCalledWith('job-1');
    });

    it('should throw when job is not found', async () => {
      mockJobRepository.findById.mockResolvedValue(undefined);

      await expect(jobService.getJobById('missing-id')).rejects.toThrow(HttpError);
    });
  });

  describe('addJob', () => {
    it('should create and save a new job', async () => {
      mockJobRepository.save.mockImplementation(async (job) => job);

      const result = await jobService.addJob({
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

  describe('searchJobs', () => {
    it('should filter jobs by location', async () => {
      const jobs: Job[] = [
        { ...mockJob, id: '1', location: 'Melbourne' },
        { ...mockJob, id: '2', location: 'Sydney' },
      ];
      mockJobRepository.findAll.mockResolvedValue(jobs);

      const result = await jobService.searchJobs({ location: 'Melbourne' });

      expect(result).toHaveLength(1);
      expect(result[0].location).toBe('Melbourne');
    });

    it('should filter jobs by title', async () => {
      const jobs: Job[] = [
        { ...mockJob, id: '1', title: 'Senior Software Engineer' },
        { ...mockJob, id: '2', title: 'Product Manager' },
      ];
      mockJobRepository.findAll.mockResolvedValue(jobs);

      const result = await jobService.searchJobs({ title: 'engineer' });

      expect(result).toHaveLength(1);
      expect(result[0].title).toContain('Engineer');
    });

    it('should return all jobs when no filters are provided', async () => {
      const jobs = [mockJob];
      mockJobRepository.findAll.mockResolvedValue(jobs);

      const result = await jobService.searchJobs({});

      expect(result).toEqual(jobs);
    });
  });

  describe('updateJob', () => {
    it('should update a job when it exists', async () => {
      const updatedJob = { ...mockJob, title: 'Lead Engineer' };
      mockJobRepository.update.mockResolvedValue(updatedJob);

      const result = await jobService.updateJob('job-1', { title: 'Lead Engineer' });

      expect(result.title).toBe('Lead Engineer');
      expect(mockJobRepository.update).toHaveBeenCalledWith('job-1', { title: 'Lead Engineer' });
    });

    it('should throw when updating a non-existent job', async () => {
      mockJobRepository.update.mockResolvedValue(undefined);

      await expect(jobService.updateJob('missing', { title: 'x' })).rejects.toThrow(HttpError);
    });
  });

  describe('removeJob', () => {
    it('should remove a job when it exists', async () => {
      mockJobRepository.remove.mockResolvedValue(true);

      await expect(jobService.removeJob('job-1')).resolves.toBeUndefined();
      expect(mockJobRepository.remove).toHaveBeenCalledWith('job-1');
    });

    it('should throw when removing a non-existent job', async () => {
      mockJobRepository.remove.mockResolvedValue(false);

      await expect(jobService.removeJob('missing')).rejects.toThrow(HttpError);
    });
  });
});
