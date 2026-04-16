import { Job } from '../../domain/models/job';

interface FormattedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedAt: string;
  platform: string;
}

const formatJobForPlatform = (job: Job) => (platform: string): FormattedJob => {
  const salaryDisplay = platform === 'seek'
    ? `$${job.salary.toLocaleString()} per year`
    : `${job.salary.toLocaleString()} AUD`;

  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    salary: salaryDisplay,
    postedAt: job.postedAt.toISOString(),
    platform,
  };
};

export { formatJobForPlatform, FormattedJob };
