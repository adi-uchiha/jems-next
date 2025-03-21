
import { useState } from "react";
import { Heart, Share2, BookmarkPlus, ExternalLink, Building, MapPin, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/Badge";
import { Tag } from "@/components/Tag";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface JobDetailHeaderProps {
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
}

export const JobDetailHeader = ({ job }: JobDetailHeaderProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Job removed" : "Job saved",
      description: isSaved
        ? `${job.title} has been removed from your saved jobs`
        : `${job.title} has been saved to your profile`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Job link has been copied to clipboard",
    });
  };

  const handleApply = () => {
    toast({
      title: "Application started",
      description: "You've started the application process",
    });
  };

  return (
    <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="relative flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={job.logo}
                alt={`${job.company} logo`}
                className="w-full h-full object-contain p-2"
                loading="lazy"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-semibold text-gray-900">{job.title}</h1>
                {job.isNew && (
                  <Badge
                    text="New"
                    variant="filled"
                    color="success"
                  />
                )}
                {job.isFeatured && (
                  <Badge
                    text="Featured"
                    variant="filled"
                    color="warning"
                  />
                )}
              </div>
              <p className="text-gray-700">{job.company}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{job.postedDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center text-xs text-gray-500">
                <span className="mr-1">via</span>
                <div className="w-4 h-4 mr-1">
                  <img
                    src={job.platformLogo}
                    alt={`${job.platform} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span>{job.platform}</span>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share job</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-8 w-8 rounded-full",
                        isSaved && "text-blue-600 border-blue-200 bg-blue-50"
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

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={handleApply}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Apply Now
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open(`https://${job.platform.toLowerCase()}.com/jobs/${job.id}`, "_blank")}
              >
                <span className="mr-1">View Original</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <Tag
              key={tag}
              text={tag}
              size="md"
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
        </div>
      </div>
    </div>
  );
};

export default JobDetailHeader;
