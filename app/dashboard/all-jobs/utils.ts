import { Building } from 'lucide-react';
import { BaseJob, JobDisplayProps, SimilarJob } from "./types";

export const getPlatformLogo = (sourceSite: string | null): { logo: string; platform: string } => {
  switch (sourceSite?.toLowerCase()) {
    case 'linkedin':
      return { logo: '/images/platforms/linkedin.svg', platform: 'LinkedIn' };
    case 'indeed':
      return { logo: '/images/platforms/indeed.svg', platform: 'Indeed' };
    case 'glassdoor':
      return { logo: '/images/platforms/glassdoor.svg', platform: 'Glassdoor' };
    default:
      return { logo: '/images/platforms/default.svg', platform: 'JEMS' };
  }
};

export const mapJobToDisplayProps = (job: BaseJob): JobDisplayProps => {
  const { logo: platformLogo, platform } = getPlatformLogo(job.source_site);
  
  return {
    id: job.id.toString(),
    title: job.title,
    company: job.company,
    logo: 'building-icon',  // This is handled by the component using Building from lucide-react
    location: job.location || 'Remote',
    jobType: job.job_type || 'Full-time',
    salary: job.salary_min && job.salary_max 
      ? `${job.salary_currency || '$'}${job.salary_min}-${job.salary_max}`
      : 'Salary not specified',
    postedDate: new Date(job.created_at).toLocaleDateString(),
    description: job.description || 'No description provided',
    platform,
    platformLogo,
    tags: [],
    isFeatured: false,
    isNew: new Date(job.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  };
};

export const mapToSimilarJob = (job: BaseJob): SimilarJob => ({
  id: job.id.toString(),
  title: job.title,
  company: job.company,
  location: job.location || 'Remote',
  jobType: job.job_type || 'Full-time',
  postedDate: new Date(job.created_at).toLocaleDateString()
});
