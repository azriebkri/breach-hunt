import { Clock } from '../../src/entities/gateways/clock';
import { IdGenerator } from '../../src/entities/gateways/idGenerator';
import { JobApplicationRepository } from '../../src/entities/gateways/jobApplicationRepository';
import { JobRepository } from '../../src/entities/gateways/jobRepository';
import { LoggerGateway } from '../../src/entities/gateways/logger';
import { NotificationGateway } from '../../src/entities/gateways/notificationGateway';
import { JobApplication } from '../../src/entities/jobApplication';
import { createApplyToJobInteractor } from '../../src/usecases/applyToJob/applyToJobInteractor';
import { createGetApplicationsForJobInteractor } from '../../src/usecases/getApplicationsForJob/getApplicationsForJobInteractor';

const createMockApplicationRepository = (): jest.Mocked<JobApplicationRepository> => ({
  findByJobId: jest.fn(),
  save: jest.fn(),
});

const createMockJobRepository = (): jest.Mocked<JobRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

const createMockNotificationGateway = (): jest.Mocked<NotificationGateway> => ({
  send: jest.fn(),
});

const createMockLogger = (): jest.Mocked<LoggerGateway> => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
});

const createMockClock = (fixedDate = new Date('2024-06-01T00:00:00Z')): jest.Mocked<Clock> => ({
  now: jest.fn().mockReturnValue(fixedDate),
});

const createMockIdGenerator = (id = 'app-1'): jest.Mocked<IdGenerator> => ({
  next: jest.fn().mockReturnValue(id),
});

describe('JobApplication interactors', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('applyToJobInteractor.applyToJob', () => {
    it('should create an application when the job exists', async () => {
      const mockJobRepository = createMockJobRepository();
      const mockApplicationRepository = createMockApplicationRepository();
      const mockNotificationGateway = createMockNotificationGateway();

      const mockJob = {
        id: 'job-1',
        title: 'Software Engineer',
        description: 'Write code',
        company: 'SEEK',
        location: 'Melbourne',
        salary: 120000,
        postedAt: new Date(),
      };

      mockJobRepository.findById.mockResolvedValue(mockJob);
      mockApplicationRepository.save.mockImplementation(async (app) => app);
      mockNotificationGateway.send.mockResolvedValue(undefined);

      const { applyToJob } = createApplyToJobInteractor({
        jobRepository: mockJobRepository,
        applicationRepository: mockApplicationRepository,
        notificationGateway: mockNotificationGateway,
        idGenerator: createMockIdGenerator('app-1'),
        clock: createMockClock(),
        logger: createMockLogger(),
        config: { notificationsEnabled: true, notificationRetries: 1 },
      });

      const result = await applyToJob('job-1', {
        applicantName: 'Jane Doe',
        applicantEmail: 'jane@example.com',
        coverLetter: 'I am excited to apply...',
      });

      expect(result.jobId).toBe('job-1');
      expect(result.applicantName).toBe('Jane Doe');
      expect(result.applicantEmail).toBe('jane@example.com');
      expect(mockApplicationRepository.save).toHaveBeenCalledTimes(1);
      expect(mockNotificationGateway.send).toHaveBeenCalledWith(
        'jane@example.com',
        expect.stringContaining('Software Engineer'),
      );
    });

    it('should throw ApplicationFailedError when the job does not exist', async () => {
      const mockJobRepository = createMockJobRepository();
      const mockApplicationRepository = createMockApplicationRepository();
      const mockNotificationGateway = createMockNotificationGateway();

      mockJobRepository.findById.mockResolvedValue(undefined);

      const { applyToJob } = createApplyToJobInteractor({
        jobRepository: mockJobRepository,
        applicationRepository: mockApplicationRepository,
        notificationGateway: mockNotificationGateway,
        idGenerator: createMockIdGenerator(),
        clock: createMockClock(),
        logger: createMockLogger(),
        config: { notificationsEnabled: true, notificationRetries: 1 },
      });

      await expect(
        applyToJob('missing-job', {
          applicantName: 'Jane',
          applicantEmail: 'jane@example.com',
          coverLetter: 'Hello',
        }),
      ).rejects.toMatchObject({ name: 'ApplicationFailedError' });
    });
  });

  describe('getApplicationsForJobInteractor.getApplicationsForJob', () => {
    it('should return applications for a given job', async () => {
      const mockApplicationRepository = createMockApplicationRepository();
      const mockApplications: JobApplication[] = [
        {
          id: 'app-1',
          jobId: 'job-1',
          applicantName: 'Alice',
          applicantEmail: 'alice@example.com',
          coverLetter: 'Hire me',
          appliedAt: new Date(),
        },
      ];

      mockApplicationRepository.findByJobId.mockResolvedValue(
        mockApplications,
      );

      const { getApplicationsForJob } = createGetApplicationsForJobInteractor(
        mockApplicationRepository,
      );
      const result = await getApplicationsForJob('job-1');

      expect(result).toEqual(mockApplications);
      expect(mockApplicationRepository.findByJobId).toHaveBeenCalledWith(
        'job-1',
      );
    });
  });
});
