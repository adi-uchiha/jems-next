import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScraperForm } from "@/components/ScraperForm";
import { StatusBadge } from "@/components/StatusBadge";
import { Job } from "@/components/JobList";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ScraperProps {
  className?: string;
  style?: React.CSSProperties;
}

// This could be moved to a context or state management if needed
let isScrapingActive = false;

export function JobScraper({ className, style }: ScraperProps) {
  const [status, setStatus] = useState<"idle" | "scraping" | "success" | "error">("idle");
  const navigate = useNavigate();

  const handleSubmit = (values: any) => {
    if (isScrapingActive) {
      toast.error("A scraping session is already in progress", {
        description: "Please wait for the current session to complete."
      });
      return;
    }

    setStatus("scraping");
    isScrapingActive = true;
    
    // Simulate scraping without progress updates
    setTimeout(() => {
      setStatus("success");
      isScrapingActive = false;
      
      // Generate the jobs and store in localStorage
      const scrapedJobs = generateMockJobs(values);
      const sessionId = `session-${Date.now()}`;
      
      // Store session data
      const sessionData = {
        id: sessionId,
        query: values,
        jobs: scrapedJobs,
        timestamp: new Date().toISOString(),
        metrics: {
          totalJobs: scrapedJobs.length,
          averageSalary: calculateAverageSalary(scrapedJobs),
          companies: [...new Set(scrapedJobs.map(job => job.company))].length,
          locations: [...new Set(scrapedJobs.map(job => job.location))].length,
          executionTimeMs: Math.floor(Math.random() * 3000) + 2000,
        }
      };
      
      localStorage.setItem(sessionId, JSON.stringify(sessionData));
      
      // Navigate to results page with session ID
      navigate(`/results/${sessionId}`);
    }, 3000);
  };

  return (
    <div className={className} style={style}>
      <Card className="overflow-hidden border-border/40 shadow-lg transition-all duration-300 glass-light dark:neo-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-medium">Job Scraper</CardTitle>
              <CardDescription className="mt-1">Search and scrape job listings</CardDescription>
            </div>
            <StatusBadge status={status} />
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <ScraperForm onSubmit={handleSubmit} isLoading={status === "scraping"} />
        </CardContent>
      </Card>
    </div>
  );
}

function generateMockJobs(criteria: any): Job[] {
  const companies = ["Apple", "Google", "Microsoft", "Amazon", "Netflix", "Meta", "Spotify", "Airbnb"];
  const locations = ["San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX", "Boston, MA", "Remote"];
  const types = ["Full-time", "Part-time", "Contract", "Remote"];
  const skills = ["JavaScript", "React", "TypeScript", "Node.js", "Python", "SQL", "AWS", "Docker", "GraphQL", "Git"];
  
  const jobTitle = criteria.jobTitle || "Software Engineer";
  const companyFilter = criteria.company || "";
  const locationFilter = criteria.location || "";
  
  const count = Math.floor(Math.random() * 5) + 3; // Generate 3-7 job listings
  
  return Array.from({ length: count }).map((_, index) => {
    const company = companyFilter || companies[Math.floor(Math.random() * companies.length)];
    const location = locationFilter || locations[Math.floor(Math.random() * locations.length)];
    const randomSkills = shuffleArray([...skills]).slice(0, Math.floor(Math.random() * 5) + 2);
    const daysAgo = Math.floor(Math.random() * 30);
    
    return {
      id: `job-${index}`,
      title: jobTitle,
      company,
      location,
      description: `We are seeking a ${jobTitle} to join our team at ${company}. The ideal candidate will have experience with ${randomSkills.join(", ")}. This role will involve developing and maintaining software applications, collaborating with cross-functional teams, and implementing best practices in software development.`,
      postedDate: daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`,
      salary: `$${(Math.floor(Math.random() * 70) + 80)}k - $${(Math.floor(Math.random() * 50) + 130)}k`,
      type: types[Math.floor(Math.random() * types.length)],
      url: `https://example.com/jobs/${index}`,
      skills: randomSkills,
    };
  });
}

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function calculateAverageSalary(jobs: Job[]): number {
  const jobsWithSalary = jobs.filter(job => job.salary);
  
  if (jobsWithSalary.length === 0) return 0;
  
  const salarySum = jobsWithSalary.reduce((sum, job) => {
    const salaryString = job.salary || "";
    const salaryMatch = salaryString.match(/\$(\d+)k\s*-\s*\$(\d+)k/);
    
    if (salaryMatch) {
      const minSalary = parseInt(salaryMatch[1], 10);
      const maxSalary = parseInt(salaryMatch[2], 10);
      return sum + ((minSalary + maxSalary) / 2);
    }
    
    return sum;
  }, 0);
  
  return Math.round(salarySum / jobsWithSalary.length);
}
