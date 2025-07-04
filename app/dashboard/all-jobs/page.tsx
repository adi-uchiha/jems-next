'use client'
import { useState, useEffect } from "react";
import { Filter, MapPin, LayoutGrid, LayoutList, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/Badge";
import { JobCard } from "@/components/JobCard";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { BaseJob, JobFilters } from "./types";
import { mapJobToDisplayProps } from "./utils";

const AllJobsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [jobs, setJobs] = useState<BaseJob[]>([]);
  const [animatedJobs, setAnimatedJobs] = useState<number[]>([]);
  const [filters, setFilters] = useState<JobFilters>({
    jobTypes: [],
    experience: [],
    salaryRange: [0, 200]
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level"];

  // Simulate jobs loading with animation
  useEffect(() => {
    const jobIds = jobs.map(job => Number(job.id));
    const timer = setTimeout(() => {
      setAnimatedJobs(jobIds);
    }, 100);
    return () => clearTimeout(timer);
  }, [jobs]);

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (job.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (job.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const handleFilterChange = (type: keyof JobFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleJobTypeChange = (type: string, checked: boolean | string) => {
    if (checked) {
      handleFilterChange('jobTypes', [...filters.jobTypes, type]);
    } else {
      handleFilterChange('jobTypes', filters.jobTypes.filter(t => t !== type));
    }
  };

  const handleExperienceChange = (level: string, checked: boolean | string) => {
    if (checked) {
      handleFilterChange('experience', [...filters.experience, level]);
    } else {
      handleFilterChange('experience', filters.experience.filter(e => e !== level));
    }
  };

  const resetFilters = () => {
    setFilters({
      jobTypes: [],
      experience: [],
      salaryRange: [0, 200]
    });
  };

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams({
          search: searchTerm,
          page: currentPage.toString(),
          limit: '10',
          jobTypes: filters.jobTypes.join(','),
          salaryMin: filters.salaryRange[0].toString(),
          salaryMax: filters.salaryRange[1].toString()
        });

        const response = await fetch(`/api/dashboard/jobs?${searchParams}`);
        if (!response.ok) throw new Error('Failed to fetch jobs');
        
        const data = await response.json();
        setJobs(data.jobs);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchTerm, currentPage, filters]);

  // Update the jobs grid section to handle loading state
  const renderJobsContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-panel p-5 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-lg bg-muted" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!filteredJobs.length) {
      return (
        <div className="glass-panel py-16 text-center">
          <p className="text-muted-foreground">No jobs found matching your criteria.</p>
          <Button 
            variant="link" 
            className="mt-2 text-primary hover:text-primary/80"
            onClick={resetFilters}
          >
            Clear filters
          </Button>
        </div>
      );
    }

    return (
      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
        {filteredJobs.map((job) => (
          <JobCard 
            key={job.id} 
            job={mapJobToDisplayProps(job)}
            className={cn(
              animatedJobs.includes(Number(job.id)) ? "animate-scale-in" : "opacity-0",
              "card-hover-effect"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/10 dark:via-background/50 dark:to-background" />
        <div className="absolute inset-0 bg-grid-small-white/[0.015] dark:bg-grid-small-white/[0.025]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="glass-panel max-w-3xl mx-auto animate-slide-up">
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
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="filter-section sticky top-20">
              <div className="filter-group">
                <h3 className="filter-header">Job Type</h3>
                {jobTypes.map((type) => (
                  <label key={type} className="filter-label">
                    <Checkbox
                      checked={filters.jobTypes.includes(type)}
                      onCheckedChange={(checked) => handleJobTypeChange(type, checked)}
                      className="mr-2"
                    />
                    {type}
                  </label>
                ))}
              </div>

              <div className="filter-divider" />

              <div className="filter-group">
                <h3 className="filter-header">Salary Range</h3>
                <div className="pt-2 px-1">
                  <Slider
                    min={0}
                    max={200}
                    step={5}
                    value={filters.salaryRange}
                    onValueChange={(value) => handleFilterChange('salaryRange', value)}
                    className="[&>.relative]:bg-primary/20 dark:[&>.relative]:bg-primary/30"
                  />
                  <div className="flex justify-between mt-2">
                    <span className="filter-range-value">${filters.salaryRange[0]}k</span>
                    <span className="filter-range-value">${filters.salaryRange[1]}k</span>
                  </div>
                </div>
              </div>

              <div className="filter-divider" />

              <div className="filter-group">
                <h3 className="filter-header">Experience Level</h3>
                {experienceLevels.map((level) => (
                  <label key={level} className="filter-label">
                    <Checkbox
                      checked={filters.experience.includes(level)}
                      onCheckedChange={(checked) => handleExperienceChange(level, checked)}
                      className="mr-2"
                    />
                    {level}
                  </label>
                ))}
              </div>

              <div className="filter-divider" />

              <div className="flex justify-between items-center">
                <span className="filter-header">Active Filters</span>
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={resetFilters}
                  className="text-primary hover:text-primary/90 dark:text-primary dark:hover:text-primary/90"
                >
                  Reset All
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {filters.jobTypes.map((filter) => (
                  <span key={filter} className="filter-badge">
                    {filter}
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer opacity-60 hover:opacity-100" 
                      onClick={() => handleJobTypeChange(filter, false)}
                    />
                  </span>
                ))}
                {filters.experience.map((filter) => (
                  <span key={filter} className="filter-badge">
                    {filter}
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer opacity-60 hover:opacity-100" 
                      onClick={() => handleExperienceChange(filter, false)}
                    />
                  </span>
                ))}
                {filters.salaryRange[0] !== 0 || filters.salaryRange[1] !== 200 ? (
                  <span className="filter-badge">
                    Salary: ${filters.salaryRange[0]}k - ${filters.salaryRange[1]}k
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer opacity-60 hover:opacity-100" 
                      onClick={() => handleFilterChange('salaryRange', [0, 200])}
                    />
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Job listings */}
          <div className="flex-1">
            {/* Stats and controls */}
            <div className="glass-panel p-5 mb-6">
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

            {/* Jobs grid with loading state */}
            {renderJobsContent()}

            {/* Pagination - only show when we have jobs and not loading */}
            {!loading && filteredJobs.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center space-x-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="w-8 h-8"
                  >
                    <span className="sr-only">Previous</span>
                    <span aria-hidden="true">&lt;</span>
                  </Button>
                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="icon"
                      className={cn(
                        "w-8 h-8",
                        currentPage === i + 1 && "bg-blue-50 text-blue-600 border-blue-200"
                      )}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="w-8 h-8"
                  >
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

export default AllJobsPage;
