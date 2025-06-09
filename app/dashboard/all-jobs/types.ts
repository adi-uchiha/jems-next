import { LucideIcon } from 'lucide-react';

export interface BaseJob {
  id: number;
  title: string;
  company: string;
  location: string | null;
  job_type: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  job_url: string | null;
  description: string | null;
  created_at: string;
  source_site: string | null;
}

export interface JobDisplayProps {
  id: string;
  title: string;
  company: string;
  logo: string;  // Required for JobDetailHeader
  location: string;
  jobType: string;
  salary: string;
  postedDate: string;
  description: string;
  platform: string;
  platformLogo: string;
  tags: string[];
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface SimilarJob {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  postedDate: string;
}

export interface JobFilters {
  jobTypes: string[];
  experience: string[];
  salaryRange: [number, number];
}
