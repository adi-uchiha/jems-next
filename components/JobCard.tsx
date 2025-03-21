import { useState } from "react";
import Link from "next/link";
import { Heart, ExternalLink, BookmarkPlus, ThumbsUp, ThumbsDown, MapPin, Briefcase, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/Tag";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    logo: string;
    location: string;
    salary: string;
    jobType: string;
    postedDate: string;
    description: string;
    platform: string;
    platformLogo: string;
    tags: string[];
    isFeatured?: boolean;
    isNew?: boolean;
  };
  className?: string;
}

export const JobCard = ({ job, className }: JobCardProps) => {
  return (
    <Link href={`/dashboard/all-jobs/job-details/${job.id}`} className="block">
      <div className={cn(
        "glass-panel",
        "hover:shadow-lg hover:-translate-y-1",
        "relative card-hover-effect",
        "dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]",
        className
      )}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted/50 dark:bg-muted/30">
                <img
                  src={job.logo}
                  alt={`${job.company} logo`}
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{job.title}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm text-muted-foreground">{job.company}</span>
                  <div className="flex items-center gap-2">
                    {job.isNew && (
                      <Badge 
                        variant="secondary"
                        className="bg-primary/20 text-primary hover:bg-primary/30"
                      >
                        New
                      </Badge>
                    )}
                    {job.isFeatured && (
                      <Badge 
                        variant="secondary"
                        className="bg-orange-500/20 text-orange-500 hover:bg-orange-500/30"
                      >
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{job.jobType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>{job.salary}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-t border-border/40 pt-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 relative">
                  <img 
                    src={job.platformLogo} 
                    alt={`${job.platform} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  Posted on {job.platform}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {job.postedDate}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="border-border/50 text-muted-foreground text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
