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
  let salaryDisplay: string;
  if (platform === 'seek') {
    salaryDisplay = `$${job.salary.toLocaleString()} per year`;
  } else if (platform === 'linkedin') {
    salaryDisplay = `AUD ${job.salary.toLocaleString()}`;
  } else if (platform === 'glassdoor') {
    salaryDisplay = `${job.salary.toLocaleString()} (Est.)`;
  } else if (platform === 'monster') {
    salaryDisplay = `${job.salary.toLocaleString()}/yr AUD`;
  } else {
    salaryDisplay = `${job.salary.toLocaleString()} AUD`;
  }

  let postedAtDisplay: string;
  if (platform === 'seek' || platform === 'indeed') {
    postedAtDisplay = job.postedAt.toISOString();
  } else if (platform === 'linkedin') {
    postedAtDisplay = job.postedAt.toDateString();
  } else {
    postedAtDisplay = job.postedAt.toISOString();
  }

  return {
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    salary: salaryDisplay,
    postedAt: postedAtDisplay,
    platform,
  };
};

export { formatJobForPlatform, FormattedJob };
