import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface JobRecommendationCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    url: string;
  };
  className?: string;
  style?: React.CSSProperties;
}

export function JobRecommendationCard({ 
  job, 
  className,
  style 
}: JobRecommendationCardProps) {
  // Determine source icon based on URL
  const getSourceIcon = (url: string) => {
    if (url.includes('linkedin')) return '/images/platforms/linkedin.svg';
    if (url.includes('indeed')) return '/images/platforms/indeed.webp';
    if (url.includes('glassdoor')) return '/images/platforms/glassdoor.svg';
    return '/images/platforms/default.svg';
  };

  return (
    <Card 
      className={cn(
        "w-[300px] shrink-0 cursor-pointer",
        "hover:shadow-md transition-all duration-200",
        "border-border/50 dark:border-border/30",
        "bg-card/50 dark:bg-card/40 backdrop-blur-sm",
        className
      )}
      style={style}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-foreground line-clamp-2">
            {job.title}
          </h3>
          <a 
            href={job.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Image
              src={getSourceIcon(job.url)}
              alt="Source"
              width={20}
              height={20}
              className="opacity-80 hover:opacity-100"
            />
          </a>
        </div>
        
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{job.company}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{job.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}