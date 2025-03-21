import { CheckCircle2, AlertCircle, Clock, FileText, GraduationCap, Building } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface JobDetailContentProps {
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
    responsibilities?: string[];
    requirements?: string[];
    benefits?: string[];
    aboutCompany?: string;
    platform: string;
    platformLogo: string;
    tags: string[];
  };
}

export const JobDetailContent = ({ job }: JobDetailContentProps) => {
  return (
    <div className={cn(
      "rounded-lg border border-border/50",
      "bg-card/50 backdrop-blur-sm",
      "dark:border-border/30 dark:bg-card/40",
      "overflow-hidden"
    )}>
      <div className="p-6 sm:p-8">
        <div className="space-y-8">
          {/* Job Description */}
          <section>
            <h2 className="text-lg font-medium text-foreground mb-3">
              Job Description
            </h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {job.description}
            </p>
          </section>

          <Separator className="bg-border/50 dark:bg-border/30" />

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-medium text-foreground">Key Responsibilities</h2>
              </div>
              <ul className="space-y-2">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-medium text-foreground">Requirements</h2>
              </div>
              <ul className="space-y-2">
                {job.requirements.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-medium text-foreground">Benefits</h2>
              </div>
              <ul className="space-y-2">
                {job.benefits.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* About Company */}
          {job.aboutCompany && (
            <section>
              <div className="flex items-center mb-4">
                <Building className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-medium text-foreground">About {job.company}</h2>
              </div>
              <p className="text-muted-foreground">{job.aboutCompany}</p>
            </section>
          )}

          {/* Application Process */}
          <section className={cn(
            "rounded-lg p-4",
            "bg-primary/5 dark:bg-primary/10",
            "border border-primary/10 dark:border-primary/20"
          )}>
            <div className="flex items-center mb-3">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-medium text-foreground">Application Process</h2>
            </div>
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-muted-foreground">
                <p>
                  To apply for this position, click the "Apply Now" button and follow the 
                  instructions on the {job.platform} website. Make sure your resume is up to date
                  before starting the application process.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge text={`Apply on ${job.platform}`} variant="filled" color="info" />
                  <Badge text="Easy Application" variant="outline" color="success" />
                  <Badge text={`Posted ${job.postedDate}`} variant="outline" color="default" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default JobDetailContent;
