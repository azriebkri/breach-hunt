import { createJobApplicationService } from '../../src/application/services/job-application-service';
import { JobApplicationRepository } from '../../src/domain/ports/job-application-repository';
import { NotificationPort } from '../../src/domain/ports/notification-port';
import { JobApplication } from '../../src/domain/models/job-application';
import { ApplicationFailedError } from '../../src/domain/errors/application-failed';
import { InMemoryJobRepository } from '../../src/infrastructure/repositories/in-memory-job-repository';

const mockApplicationRepository: jest.Mocked<JobApplicationRepository> = {
  findByJobId: jest.fn(),
  save: jest.fn(),
};

const mockNotificationPort: jest.Mocked<NotificationPort> = {
  send: jest.fn(),
};

const mockJobRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
} as unknown as jest.Mocked<InMemoryJobRepository>;

describe('JobApplicationService', () => {
  let applicationService: ReturnType<typeof createJobApplicationService>;

  beforeEach(() => {
    jest.clearAllMocks();
    applicationService = createJobApplicationService(
      mockApplicationRepository,
      mockNotificationPort,
      mockJobRepository,
    );
  });

  describe('applyToJob', () => {
    it('should create an application when the job exists', async () => {
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
      mockNotificationPort.send.mockResolvedValue({ data: {}, status: 200, statusText: 'OK', headers: {}, config: {} } as never);

      const result = await applicationService.applyToJob('job-1', {
        applicantName: 'Jane Doe',
        applicantEmail: 'jane@example.com',
        coverLetter: 'I am excited to apply...',
      });

      expect(result.jobId).toBe('job-1');
      expect(result.applicantName).toBe('Jane Doe');
      expect(result.applicantEmail).toBe('jane@example.com');
      expect(mockApplicationRepository.save).toHaveBeenCalledTimes(1);
      expect(mockNotificationPort.send).toHaveBeenCalledWith(
        'jane@example.com',
        expect.stringContaining('Software Engineer'),
      );
    });

    it('should throw ApplicationFailedError when the job does not exist', async () => {
      mockJobRepository.findById.mockResolvedValue(undefined);

      await expect(
        applicationService.applyToJob('missing-job', {
          applicantName: 'Jane',
          applicantEmail: 'jane@example.com',
          coverLetter: 'Hello',
        }),
      ).rejects.toThrow(ApplicationFailedError);
    });
  });

  describe('getApplicationsForJob', () => {
    it('should return applications for a given job', async () => {
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

      mockApplicationRepository.findByJobId.mockResolvedValue(mockApplications);

      const result = await applicationService.getApplicationsForJob('job-1');

      expect(result).toEqual(mockApplications);
      expect(mockApplicationRepository.findByJobId).toHaveBeenCalledWith('job-1');
    });
  });
});
