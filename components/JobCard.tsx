import { useState } from "react";
import Link from "next/link";
import { Heart, ExternalLink, BookmarkPlus, ThumbsUp, ThumbsDown } from "lucide-react";
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
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLiked) {
      setIsLiked(true);
      setIsDisliked(false);
      toast({
        title: "Job liked",
        description: `You've liked ${job.title} at ${job.company}`,
      });
    } else {
      setIsLiked(false);
    }
  };

  const handleDislike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isDisliked) {
      setIsDisliked(true);
      setIsLiked(false);
      toast({
        title: "Job disliked",
        description: `You've disliked ${job.title} at ${job.company}`,
      });
    } else {
      setIsDisliked(false);
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Job removed" : "Job saved",
      description: isSaved
        ? `${job.title} has been removed from your saved jobs`
        : `${job.title} has been saved to your profile`,
    });
  };

  return (
    <Link href={`/dashboard/all-jobs/job-details/${job.id}`} className="block">
      <div
        className={cn(
          "glass-panel",
          "hover:shadow-lg hover:-translate-y-1",
          "relative card-hover-effect",
          "dark:hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]",
          className
        )}
      >
        {job.isFeatured && (
          <div className="absolute top-0 right-0">
            <Badge 
              variant="secondary" 
              className={cn(
                "rounded-bl-md rounded-tr-md",
                "bg-primary/20 text-primary dark:bg-primary/30"
              )}
            >
              Featured
            </Badge>
          </div>
        )}
        
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative flex-shrink-0 w-12 h-12 bg-muted rounded-md overflow-hidden">
                <img
                  src={job.logo}
                  alt={`${job.company} logo`}
                  className="w-full h-full object-contain p-1"
                  loading="lazy"
                  onLoad={(e) => e.currentTarget.classList.add('loaded')}
                />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{job.title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5 flex items-center">
                  {job.company}
                  {job.isNew && (
                    <Badge variant="default" className="ml-2">
                      New
                    </Badge>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">via</span>
              <div className="w-5 h-5">
                <img
                  src={job.platformLogo}
                  alt={`${job.platform} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.slice(0, 3).map((tag) => (
              <Tag
                key={tag}
                text={tag}
                color={
                  tag.includes("Remote")
                    ? "green"
                    : tag.includes("Full")
                    ? "blue"
                    : tag.includes("Part")
                    ? "purple"
                    : tag.includes("Contract")
                    ? "yellow"
                    : "gray"
                }
              />
            ))}
            {job.tags.length > 3 && (
              <span className="text-xs text-gray-500 flex items-center">
                +{job.tags.length - 3} more
              </span>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-foreground">{job.location}</span>
              <span className="text-foreground">{job.salary}</span>
            </div>
            <span className="text-muted-foreground">{job.postedDate}</span>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-full",
                        isLiked && "text-primary bg-primary/10 dark:bg-primary/20"
                      )}
                      onClick={handleLike}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isLiked ? "Liked" : "Like this job"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-full",
                        isDisliked && "text-red-600 bg-red-50"
                      )}
                      onClick={handleDislike}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isDisliked ? "Disliked" : "Dislike this job"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-full",
                        isSaved && "text-blue-600 bg-blue-50"
                      )}
                      onClick={handleSave}
                    >
                      {isSaved ? (
                        <Heart className="h-4 w-4 fill-blue-600" />
                      ) : (
                        <BookmarkPlus className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isSaved ? "Saved to your profile" : "Save this job"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.preventDefault();
                window.open(`/job/${job.id}`, "_blank");
              }}
            >
              <span className="mr-1">View</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
