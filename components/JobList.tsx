
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Building, ExternalLink, ThumbsUp, ThumbsDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postedDate: string;
  salary?: string;
  type?: string;
  url: string;
  skills?: string[];
}

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function JobList({ jobs, isLoading, className, style }: JobListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 gap-4 animate-fade-in", className)} style={style}>
        {Array.from({ length: 3 }).map((_, index) => (
          <JobCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className={cn("min-h-[200px] flex items-center justify-center", className)} style={style}>
        <p className="text-muted-foreground italic">No job results found. Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 gap-4", className)} style={style}>
      {jobs.map((job, index) => (
        <Card 
          key={job.id}
          className={cn(
            "overflow-hidden transition-all duration-500 hover:shadow-md",
            "animate-slide-up opacity-0"
          )}
          style={{ 
            animationDelay: `${index * 100}ms`,
            animationFillMode: "forwards"
          }}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="font-medium text-xl">{job.title}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <Building className="w-4 h-4 mr-1" /> 
                  {job.company}
                  {job.location && (
                    <>
                      <span className="mx-2">•</span>
                      <MapPin className="w-4 h-4 mr-1" /> 
                      {job.location}
                    </>
                  )}
                </CardDescription>
              </div>
              {job.postedDate && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {job.postedDate}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            {job.type && job.salary && (
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{job.type}</Badge>
                <Badge variant="secondary">{job.salary}</Badge>
              </div>
            )}
            <div className={cn(
              "text-sm leading-relaxed transition-all duration-300",
              expandedId === job.id ? "max-h-[500px]" : "max-h-[80px] overflow-hidden"
            )}>
              <p>{job.description}</p>
            </div>
            {job.description.length > 150 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 text-xs p-0 h-auto" 
                onClick={() => setExpandedId(expandedId === job.id ? null : job.id)}
              >
                {expandedId === job.id ? "Show less" : "Show more"}
              </Button>
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-0">
            <div className="flex flex-wrap gap-1">
              {job.skills?.slice(0, 3).map((skill, i) => (
                <Badge key={i} variant="outline" className="bg-secondary/50">{skill}</Badge>
              ))}
              {job.skills && job.skills.length > 3 && (
                <Badge variant="outline">+{job.skills.length - 3}</Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="h-8">
                <ThumbsUp className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="default" className="h-8" asChild>
                <a href={job.url} target="_blank" rel="noopener noreferrer">
                  Apply
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function JobCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-2">
        <div className="h-6 bg-secondary rounded-md w-3/4 mb-2"></div>
        <div className="h-4 bg-secondary rounded-md w-1/2"></div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex gap-2 mb-3">
          <div className="h-5 bg-secondary rounded-full w-20"></div>
          <div className="h-5 bg-secondary rounded-full w-24"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-secondary rounded-md w-full"></div>
          <div className="h-4 bg-secondary rounded-md w-full"></div>
          <div className="h-4 bg-secondary rounded-md w-3/4"></div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <div className="flex gap-1">
          <div className="h-5 bg-secondary rounded-full w-16"></div>
          <div className="h-5 bg-secondary rounded-full w-16"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-8 bg-secondary rounded-md w-20"></div>
          <div className="h-8 bg-primary rounded-md w-20"></div>
        </div>
      </CardFooter>
    </Card>
  );
}
