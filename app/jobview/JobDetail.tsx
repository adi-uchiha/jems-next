
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Building, Calendar, Briefcase, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/Badge";
import { Tag } from "@/components/Tag";
import { JobDetailHeader } from "@/components/JobDetailHeader";
import { JobDetailContent } from "@/components/JobDetailContent";
import Navbar from "@/components/Navbar";
import { jobs } from "@/data/jobs";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API call with a small delay
    const timer = setTimeout(() => {
      const foundJob = jobs.find(j => j.id === id);
      setJob(foundJob);
      
      if (foundJob) {
        // Find similar jobs based on tags
        const similar = jobs
          .filter(j => j.id !== id && j.tags.some(tag => foundJob.tags.includes(tag)))
          .slice(0, 3);
        setSimilarJobs(similar);
      }
      
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [id]);

  // Scroll to top when job changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-8 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-4"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 w-20 bg-gray-200 rounded"></div>
                      <div className="h-6 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-white border border-gray-200/80 rounded-xl shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm p-8">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-medium text-gray-900 mb-2">Job Not Found</h1>
              <p className="text-gray-500 mb-6">
                The job listing you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/">
                <Button>
                  Return to Job Listings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 group transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
            <span>Back to all jobs</span>
          </Link>

          {/* Job detail content */}
          <div className="space-y-6 animate-fade-in">
            <JobDetailHeader job={job} />
            <JobDetailContent job={job} />
            
            {/* Similar jobs */}
            {similarJobs.length > 0 && (
              <div className="bg-white border border-gray-200/80 rounded-xl shadow-sm overflow-hidden mt-8">
                <div className="p-6 sm:p-8">
                  <h2 className="text-lg font-medium mb-6">Similar Jobs You Might Like</h2>
                  
                  <div className="space-y-4">
                    {similarJobs.map((similarJob) => (
                      <Link 
                        key={similarJob.id} 
                        to={`/job/${similarJob.id}`}
                        className="block"
                      >
                        <div className="flex items-start space-x-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="relative flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={similarJob.logo}
                              alt={`${similarJob.company} logo`}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{similarJob.title}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Building className="h-3.5 w-3.5 mr-1" />
                              <span>{similarJob.company}</span>
                              <span className="mx-2">•</span>
                              <Briefcase className="h-3.5 w-3.5 mr-1" />
                              <span>{similarJob.jobType}</span>
                              <span className="mx-2">•</span>
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>{similarJob.postedDate}</span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {similarJob.tags.slice(0, 3).map((tag: string) => (
                                <Tag
                                  key={tag}
                                  text={tag}
                                  size="sm"
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
                      </Link>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Link to="/">
                      <Button variant="outline">
                        View All Similar Jobs
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
