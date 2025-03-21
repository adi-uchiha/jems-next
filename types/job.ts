export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  jobType: string;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  aboutCompany: string;
  platform: string;
  platformLogo: string;
  tags: string[];
  isFeatured?: boolean;
  isNew?: boolean;
}