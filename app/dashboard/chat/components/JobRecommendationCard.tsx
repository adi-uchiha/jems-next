import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, ExternalLink } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getSourceIcon } from "@/lib/utils/job-utils";

interface JobRecommendationCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    url: string;
    source_site?: string;  // Add source_site field
  };
  className?: string;
  style?: React.CSSProperties;
}

export function JobRecommendationCard({ 
  job, 
  className,
  style 
}: JobRecommendationCardProps) {
  return (
    <Card 
      className={cn(
        "w-[320px] shrink-0 cursor-pointer overflow-hidden group",
        "bg-gradient-to-b from-card/50 to-card/30",
        "backdrop-blur-sm border-border/50",
        "hover:shadow-lg hover:shadow-primary/5",
        "dark:from-card/40 dark:to-card/20",
        "dark:hover:shadow-primary/10",
        "transform transition-all duration-300",
        "hover:-translate-y-1 hover:scale-[1.02]",
        className
      )}
      style={style}
    >
      <CardContent className="p-0">
        {/* Header with source icon */}
        <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={getSourceIcon(job.url, job.source_site)}
              alt={job.source_site || "Source"}
              width={16}
              height={16}
              className="opacity-80"
            />
            <span className="text-xs text-muted-foreground font-medium">
              {job.source_site || "Job Posting"}
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary/70 transition-colors" />
        </div>

        {/* Main content */}
        <div className="p-4 space-y-4">
          {/* Title */}
          <h3 className="font-semibold text-foreground/90 line-clamp-2 group-hover:text-primary transition-colors">
            {job.title}
          </h3>

          {/* Company and Location with enhanced icons */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 bg-primary/10 rounded-md">
                <Building className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-muted-foreground line-clamp-1">
                {job.company}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="p-1.5 bg-primary/10 rounded-md">
                <MapPin className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-muted-foreground line-clamp-1">
                {job.location || "Location not specified"}
              </span>
            </div>
          </div>

          {/* Action area */}
          <div className="pt-2 flex items-center justify-between">
            <Badge 
              variant="outline" 
              className="bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              View Details
            </Badge>
            <span className="text-xs text-muted-foreground">
              via {job.source_site || "Job Board"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}