import { formatJobForPlatform } from '../../src/usecases/formatJob/formatJobForPlatform';
import { Job } from '../../src/entities/job';

const mockJob: Job = {
  id: 'job-1',
  title: 'Software Engineer',
  description: 'Write clean code',
  company: 'SEEK',
  location: 'Melbourne',
  salary: 140000,
  postedAt: new Date('2024-06-01T00:00:00.000Z'),
};

describe('formatJobForPlatform', () => {
  it('should format a job for the seek platform', () => {
    const formatter = formatJobForPlatform(mockJob);
    const result = formatter('seek');

    expect(result.id).toBe('job-1');
    expect(result.title).toBe('Software Engineer');
    expect(result.company).toBe('SEEK');
    expect(result.salary).toBe('$140,000 per year');
    expect(result.platform).toBe('seek');
    expect(result.postedAt).toBe('2024-06-01T00:00:00.000Z');
  });

  it('should format a job for a non-seek platform', () => {
    const formatter = formatJobForPlatform(mockJob);
    const result = formatter('indeed');

    expect(result.salary).toBe('140,000 AUD');
    expect(result.platform).toBe('indeed');
  });

  it('should include location in the formatted output', () => {
    const formatter = formatJobForPlatform(mockJob);
    const result = formatter('seek');

    expect(result.location).toBe('Melbourne');
  });
});
