
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Job, JobList } from "@/components/JobList";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Briefcase, ArrowLeft, PieChart, Building, MapPin, Clock, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface SessionMetrics {
  totalJobs: number;
  averageSalary: number;
  companies: number;
  locations: number;
  executionTimeMs: number;
}

interface SessionData {
  id: string;
  query: {
    jobTitle: string;
    location?: string;
    company?: string;
    websiteUrl?: string;
  };
  jobs: Job[];
  timestamp: string;
  metrics: SessionMetrics;
}

const ResultsPage = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      const data = localStorage.getItem(sessionId);
      if (data) {
        setSessionData(JSON.parse(data));
      }
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <ThemeProvider defaultTheme="light">
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/10 transition-colors duration-500">
          <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 dark:bg-background/80 border-b border-border/40 transition-colors duration-300">
            <div className="container flex items-center justify-between h-16 px-4 md:px-6">
              <div className="flex items-center gap-2 font-medium">
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="text-xl">JobRover</span>
              </div>
              <ThemeToggle />
            </div>
          </header>
          
          <main className="flex-1 container px-4 py-8 md:py-12 md:px-6 lg:py-16">
            <div className="mx-auto max-w-5xl space-y-8">
              <Skeleton className="h-12 w-3/4" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
              <Skeleton className="h-96" />
            </div>
          </main>
        </div>
      </ThemeProvider>
    );
  }

  if (!sessionData) {
    return (
      <ThemeProvider defaultTheme="light">
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/10 transition-colors duration-500">
          <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 dark:bg-background/80 border-b border-border/40 transition-colors duration-300">
            <div className="container flex items-center justify-between h-16 px-4 md:px-6">
              <div className="flex items-center gap-2 font-medium">
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="text-xl">JobRover</span>
              </div>
              <ThemeToggle />
            </div>
          </header>
          
          <main className="flex-1 container px-4 py-8 md:py-12 md:px-6 lg:py-16">
            <div className="mx-auto max-w-5xl text-center">
              <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
              <p className="mb-6">The scraping session you're looking for doesn't exist or has expired.</p>
              <Button asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Home
                </Link>
              </Button>
            </div>
          </main>
        </div>
      </ThemeProvider>
    );
  }

  const { query, jobs, timestamp, metrics } = sessionData;
  const formattedDate = new Date(timestamp).toLocaleString();
  
  // Calculate job types percentages
  const jobTypes = jobs.reduce((acc, job) => {
    const type = job.type || "Other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const jobTypeEntries = Object.entries(jobTypes)
    .sort((a, b) => b[1] - a[1]);
  
  // Calculate top skills
  const skillsCount = jobs.reduce((acc, job) => {
    if (job.skills) {
      job.skills.forEach(skill => {
        acc[skill] = (acc[skill] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);
  
  const topSkills = Object.entries(skillsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/10 transition-colors duration-500">
        <header className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 dark:bg-background/80 border-b border-border/40 transition-colors duration-300">
          <div className="container flex items-center justify-between h-16 px-4 md:px-6">
            <div className="flex items-center gap-2 font-medium">
              <Briefcase className="w-5 h-5 text-primary" />
              <span className="text-xl">JobRover</span>
            </div>
            <ThemeToggle />
          </div>
        </header>
        
        <main className="flex-1 container px-4 py-8 md:py-12 md:px-6 lg:py-16">
          <div className="mx-auto max-w-5xl">
            <div className="flex justify-between items-center mb-6">
              <Button variant="outline" asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Search
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/session/${sessionId}`}>
                  <PieChart className="mr-2 h-4 w-4" />
                  View Session Details
                </Link>
              </Button>
            </div>
            
            <div className="mb-8 animate-slide-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
              <h1 className="text-3xl font-bold mb-2">
                Search Results: {query.jobTitle}
              </h1>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span>Completed: {formattedDate}</span>
                <span>•</span>
                <span>Found {jobs.length} matching jobs</span>
                {query.location && (
                  <>
                    <span>•</span>
                    <span>Location: {query.location}</span>
                  </>
                )}
                {query.company && (
                  <>
                    <span>•</span>
                    <span>Company: {query.company}</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Jobs</CardDescription>
                  <CardTitle className="text-2xl font-medium flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-primary" />
                    {jobs.length}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Average Salary</CardDescription>
                  <CardTitle className="text-2xl font-medium flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-primary" />
                    ${metrics.averageSalary}k
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Companies</CardDescription>
                  <CardTitle className="text-2xl font-medium flex items-center">
                    <Building className="w-4 h-4 mr-2 text-primary" />
                    {metrics.companies}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Locations</CardDescription>
                  <CardTitle className="text-2xl font-medium flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    {metrics.locations}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
            
            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Job Types */}
              <Card className="animate-slide-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
                <CardHeader>
                  <div className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4 text-primary" />
                    <CardTitle>Job Types</CardTitle>
                  </div>
                  <CardDescription>Distribution of job types</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {jobTypeEntries.map(([type, count]) => {
                    const percentage = Math.round((count / jobs.length) * 100);
                    return (
                      <div key={type}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{type}</span>
                          <span className="text-sm text-muted-foreground">{count} jobs ({percentage}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
              
              {/* Skills */}
              <Card className="animate-slide-up opacity-0" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
                <CardHeader>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-primary" />
                    <CardTitle>Top Skills</CardTitle>
                  </div>
                  <CardDescription>Most in-demand skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {topSkills.map(([skill, count]) => (
                      <Badge key={skill} variant="outline" className="text-sm px-3 py-1">
                        {skill} ({count})
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Execution Statistics */}
            <Card className="mb-8 animate-slide-up opacity-0" style={{ animationDelay: "500ms", animationFillMode: "forwards" }}>
              <CardHeader>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-primary" />
                  <CardTitle>Scraping Stats</CardTitle>
                </div>
                <CardDescription>Performance metrics for this scraping session</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Execution Time</span>
                    <span className="text-xl font-semibold">{(metrics.executionTimeMs / 1000).toFixed(2)}s</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Timestamp</span>
                    <span className="text-xl">{formattedDate}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Session ID</span>
                    <span className="text-xl font-mono text-xs truncate">{sessionId}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <JobList jobs={jobs} isLoading={false} className="animate-slide-up opacity-0" style={{ animationDelay: "600ms", animationFillMode: "forwards" }} />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default ResultsPage;
