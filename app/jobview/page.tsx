'use client'
import { useState, useEffect } from "react";
import { Filter, MapPin, LayoutGrid, LayoutList, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/Badge";
import { JobCard } from "@/components/JobCard";
// import Navbar from "@/components/Navbar";
import { jobs } from "@/data/jobs";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 200]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [animatedJobs, setAnimatedJobs] = useState<string[]>([]);

  // Simulate jobs loading with animation
  useEffect(() => {
    const jobIds = jobs.map(job => job.id);
    
    const timer = setTimeout(() => {
      setAnimatedJobs(jobIds);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      
      {/* Hero section */}
      <div className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/10 dark:via-background/50 dark:to-background" />
        <div className="absolute inset-0 bg-grid-small-white/[0.015] dark:bg-grid-small-white/[0.025]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Find Your Perfect Job
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover opportunities from top companies across multiple platforms
            </p>
            
            <div className="bg-card/50 dark:bg-card/30 p-2 rounded-xl shadow-sm border border-border/50 backdrop-blur-sm max-w-3xl mx-auto animate-slide-up">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    placeholder="Job title, company, or keywords"
                    className="h-12 pl-4 pr-10 border-gray-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative md:w-48">
                  <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Select>
                    <SelectTrigger className="h-12 pl-10 border-gray-200">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anywhere">Anywhere</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700">
                  Search
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <Badge 
                text="Remote" 
                variant="filled" 
                color="success" 
                className="cursor-pointer hover:scale-105 transition-transform" 
              />
              <Badge 
                text="Full-time" 
                variant="filled" 
                color="info" 
                className="cursor-pointer hover:scale-105 transition-transform" 
              />
              <Badge 
                text="Contract" 
                variant="filled" 
                color="warning" 
                className="cursor-pointer hover:scale-105 transition-transform" 
              />
              <Badge 
                text="Engineering" 
                variant="outline" 
                color="default" 
                className="cursor-pointer hover:scale-105 transition-transform" 
              />
              <Badge 
                text="Design" 
                variant="outline" 
                color="default" 
                className="cursor-pointer hover:scale-105 transition-transform" 
              />
              <Badge 
                text="Marketing" 
                variant="outline" 
                color="default" 
                className="cursor-pointer hover:scale-105 transition-transform" 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-card/50 dark:bg-card/30 rounded-xl shadow-sm border border-border/50 p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-gray-900 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </h2>
                <Button variant="ghost" size="sm" className="text-sm text-gray-500 h-8 px-2">
                  Reset
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-5">
                {/* Job Type */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Job Type</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="fulltime" 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="fulltime" className="ml-2 text-sm text-gray-700">Full-time</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="parttime" 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="parttime" className="ml-2 text-sm text-gray-700">Part-time</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="contract" 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="contract" className="ml-2 text-sm text-gray-700">Contract</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="remote" 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="remote" className="ml-2 text-sm text-gray-700">Remote</label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Experience Level */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Experience Level</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="entry" 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="entry" className="ml-2 text-sm text-gray-700">Entry Level</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="mid" 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="mid" className="ml-2 text-sm text-gray-700">Mid Level</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="senior" 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="senior" className="ml-2 text-sm text-gray-700">Senior Level</label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Salary Range */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">Salary Range</h3>
                    <span className="text-xs text-gray-500">
                      ${salaryRange[0]}k - ${salaryRange[1]}k
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, 200]}
                    max={200}
                    step={10}
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    className="my-4"
                  />
                </div>
                
                <Separator />
                
                {/* Platform */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Platform</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="linkedin" 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="linkedin" className="ml-2 text-sm text-gray-700">LinkedIn</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="indeed" 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="indeed" className="ml-2 text-sm text-gray-700">Indeed</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="glassdoor" 
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="glassdoor" className="ml-2 text-sm text-gray-700">Glassdoor</label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Job listings */}
          <div className="flex-1">
            <div className="bg-card/50 dark:bg-card/30 rounded-xl shadow-sm border border-border/50 p-5 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Badge 
                    text={`${filteredJobs.length} Jobs`} 
                    variant="filled" 
                    color="info" 
                  />
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    Updated 2 hours ago
                  </span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="salary_high">Salary (High to Low)</SelectItem>
                      <SelectItem value="salary_low">Salary (Low to High)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-9 w-9 rounded-l-md ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                      onClick={() => setViewMode('grid')}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-9 w-9 rounded-r-md ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                      onClick={() => setViewMode('list')}
                    >
                      <LayoutList className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {filteredJobs.length > 0 ? (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
                {filteredJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    className={animatedJobs.includes(job.id) ? "animate-scale-in" : "opacity-0"}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card/50 dark:bg-card/30 rounded-xl shadow-sm border border-border/50">
                <p className="text-muted-foreground">No jobs found matching your criteria.</p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => setSearchTerm('')}
                >
                  Clear filters
                </Button>
              </div>
            )}
            
            {/* Pagination placeholder */}
            {filteredJobs.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-1">
                  <Button variant="outline" size="icon" disabled className="w-8 h-8">
                    <span className="sr-only">Previous</span>
                    <span aria-hidden="true">&lt;</span>
                  </Button>
                  <Button variant="outline" size="icon" className="w-8 h-8 bg-blue-50 text-blue-600 border-blue-200">
                    1
                  </Button>
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    2
                  </Button>
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    3
                  </Button>
                  <span className="px-2 text-gray-500">...</span>
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    8
                  </Button>
                  <Button variant="outline" size="icon" className="w-8 h-8">
                    <span className="sr-only">Next</span>
                    <span aria-hidden="true">&gt;</span>
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
