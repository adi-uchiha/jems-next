interface JobPosting {
  id: string;
  source: 'glassdoor' | 'google' | 'linkedin' | 'indeed';
  url: string;
  title: string;
  company: string;
  location: string;
  datePosted: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
}

export const jobs: JobPosting[] = [
  
  {
    id: "li-4168150744",
    source: "linkedin",
    url: "https://www.linkedin.com/jobs/view/4168150744",
    title: "Software Engineer - New Grad",
    company: "Scale AI",
    location: "San Francisco, CA",
    datePosted: "2025-02-28"
  },
  {
    id: "in-1dde3acb78bd094c",
    source: "indeed",
    url: "https://www.indeed.com/viewjob?jk=1dde3acb78bd094c",
    title: "Senior Automation QA Engineer",
    company: "NETGEAR",
    location: "San Jose, CA",
    datePosted: "2025-02-27",
    salaryRange: {
      min: 119000,
      max: 140000,
      currency: "USD"
    }
  },
  {
    id: "go-XyWUtaPO9k4lShWrAAAAAA==",
    source: "linkedin",
    url: "https://www.linkedin.com/jobs/view/senior-full-stack-developer-at-skip-4167919821",
    title: "Senior Full-stack Developer",
    company: "Skip",
    location: "San Francisco, CA",
    datePosted: "2025-02-06"
  },
  {
    id: "gd-1009521966411",
    source: "glassdoor",
    url: "https://www.glassdoor.co.in/job-listing/full-stack-developer-trainee-threeway-studio-JV_KO0,28_KE29,44.htm?jl=1009521966411&cs=1_94fe6a4b&s=58&t=SR&pos=101&jobListingId=1009521966411",
    title: "Full Stack Developer Trainee",
    company: "Threeway Studio",
    location: "Bangalore, India",
    datePosted: "2025-02-28"
  },
  {
    id: "gd-1009645146285",
    source: "glassdoor",
    url: "https://www.glassdoor.co.in/job-listing/full-stack-developer-magicmind-technologies-JV_KO0,20_KE21,43.htm?jl=1009645146285&cs=1_a7e54b12&s=58&t=SR&pos=129&src=GD_JOB_AD&guid=000001954ace7a32be8b390d19463960&jobListingId=1009645146285&ea=1&ao=1136043&vt=w&jrtk=5-yul1-0-1il5csuj822rt001-f925eac247386bc2&cb=1740716800952&ctt=1740716930732",
    title: "Full Stack Developer",
    company: "Magicmind Technologies",
    location: "Mumbai, India",
    datePosted: "2025-02-28"
  },
  {
    id: "in-ad521a25f43e9006",
    source: "indeed",
    url: "https://in.indeed.com/viewjob?jk=ad521a25f43e9006",
    title: "Full Stack Developer",
    company: "Strafox Tech Ventures Private Limited",
    location: "Bangalore, India",
    datePosted: "2025-02-27",
    salaryRange: {
      min: 600000,
      max: 1200000,
      currency: "INR"
    }
  },
  {
    id: "in-fb422139178ed51e",
    source: "indeed",
    url: "https://in.indeed.com/viewjob?jk=fb422139178ed51e",
    title: "Full Stack Intern",
    company: "Veracity Software Inc",
    location: "Hyderabad, India",
    datePosted: "2025-02-27",
    salaryRange: {
      min: 300000,
      max: 500000,
      currency: "INR"
    }
  },
  {
    id: "go-barclays-fs-dev",
    source: "google",
    url: "https://g.co/kgs/ykJo5Dw",
    title: "Full Stack Developer",
    company: "Barclays",
    location: "Pune, India",
    datePosted: "2025-02-26",
    salaryRange: {
      min: 1200000,
      max: 2500000,
      currency: "INR"
    }
  },
  {
    id: "go-microsoft-fs-dev",
    source: "google",
    url: "https://g.co/kgs/47t1Rpb",
    title: "Fullstack Developer",
    company: "Microsoft",
    location: "Bangalore, India",
    datePosted: "2025-02-26",
    salaryRange: {
      min: 2000000,
      max: 4000000,
      currency: "INR"
    }
  }
];

export default jobs;