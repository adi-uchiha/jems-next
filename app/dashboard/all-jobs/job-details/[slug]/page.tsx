'use client'

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Building, Calendar, Briefcase, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { JobDetailHeader } from "@/components/JobDetailHeader";
import { JobDetailContent } from "@/components/JobDetailContent";
import { cn } from "@/lib/utils";
import { jobs } from "@/data/jobs";
import { Job } from "@/types/job"; // We'll create this type

export default function JobDetail() {
  const params = useParams();
  const slug = params?.slug as string;
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobDetails = () => {
      setIsLoading(true);
      try {
        // Find the job with matching id from jobs data
        const foundJob = jobs.find(j => j.id === slug);
        setJob(foundJob || null);
        
        if (foundJob) {
          // Find similar jobs based on tags
          const similar = jobs
            .filter(j => 
              j.id !== slug && 
              j.tags.some(tag => foundJob.tags.includes(tag))
            )
            .slice(0, 3);
          setSimilarJobs(similar);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchJobDetails();
    }
  }, [slug]);

  // Scroll to top when job changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className={cn(
        "min-h-screen bg-background",
        "animate-in fade-in duration-500"
      )}>
        <div className="container mx-auto px-4 pt-8 pb-16">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="space-y-6">
              <div className={cn(
                "rounded-lg border border-border/50",
                "bg-card/50 backdrop-blur-sm",
                "dark:border-border/30 dark:bg-card/40",
                "overflow-hidden"
              )}>
                {/* ...loading skeleton content... */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-8 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className={cn(
              "rounded-lg border border-border/50 p-8",
              "bg-card/50 backdrop-blur-sm",
              "dark:border-border/30 dark:bg-card/40"
            )}>
              <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Job Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                The job listing you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link href="/dashboard/all-jobs">
                  Return to Job Listings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen bg-background",
      "animate-in fade-in duration-500"
    )}>
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            asChild
            className="mb-6 hover:bg-accent/50"
          >
            <Link href="/dashboard/all-jobs" className="group">
              <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to all jobs
            </Link>
          </Button>

          <div className="space-y-6">
            <JobDetailHeader job={job} />
            <JobDetailContent job={job} />
            
            {/* Similar jobs section */}
            {similarJobs.length > 0 && (
              <div className={cn(
                "rounded-lg border border-border/50 mt-8",
                "bg-card/50 backdrop-blur-sm",
                "dark:border-border/30 dark:bg-card/40",
                "overflow-hidden"
              )}>
                <div className="p-6 sm:p-8">
                  <h2 className="text-lg font-medium mb-6 text-foreground">
                    Similar Jobs You Might Like
                  </h2>
                  
                  <div className="space-y-4">
                    {similarJobs.map((similarJob) => (
                      <Link 
                        key={similarJob.id} 
                        href={`/dashboard/all-jobs/job-details/${similarJob.id}`}
                        className="block group"
                      >
                        <div className={cn(
                          "flex items-start space-x-4 p-4 rounded-lg",
                          "border border-border/50 dark:border-border/30",
                          "bg-card/50 dark:bg-card/40",
                          "hover:bg-accent/50 dark:hover:bg-accent/20",
                          "transition-colors duration-200"
                        )}>
                          <div className={cn(
                            "relative flex-shrink-0 w-10 h-10",
                            "rounded-md overflow-hidden",
                            "bg-muted/50 dark:bg-muted/30"
                          )}>
                            <img
                              src={similarJob.logo}
                              alt={`${similarJob.company} logo`}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-foreground group-hover:text-accent-foreground">
                              {similarJob.title}
                            </h3>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <Building className="h-3.5 w-3.5 mr-1" />
                              <span>{similarJob.company}</span>
                              <span className="mx-2">•</span>
                              <Briefcase className="h-3.5 w-3.5 mr-1" />
                              <span>{similarJob.jobType}</span>
                              <span className="mx-2">•</span>
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>{similarJob.postedDate}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button 
                      variant="outline"
                      className="border-border/50 hover:bg-accent/50"
                    >
                      View All Similar Jobs
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
