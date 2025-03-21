
import { CheckCircle2, AlertCircle, Clock, FileText, GraduationCap, Building } from "lucide-react";
import { Badge } from "@/components/Badge";
import { Separator } from "@/components/ui/separator";

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
    <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="space-y-8">
          {/* Job Description */}
          <section>
            <h2 className="text-lg font-medium mb-3">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </section>

          <Separator />

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <section>
              <div className="flex items-center mb-4">
                <FileText className="h-5 w-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-medium">Key Responsibilities</h2>
              </div>
              <ul className="space-y-2">
                {job.responsibilities.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
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
                <h2 className="text-lg font-medium">Requirements</h2>
              </div>
              <ul className="space-y-2">
                {job.requirements.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
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
                <h2 className="text-lg font-medium">Benefits</h2>
              </div>
              <ul className="space-y-2">
                {job.benefits.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
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
                <h2 className="text-lg font-medium">About {job.company}</h2>
              </div>
              <p className="text-gray-700">{job.aboutCompany}</p>
            </section>
          )}

          {/* Application Process */}
          <section className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center mb-3">
              <Clock className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-medium">Application Process</h2>
            </div>
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-gray-700">
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
