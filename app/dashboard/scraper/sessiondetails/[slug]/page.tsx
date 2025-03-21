'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  Briefcase, ArrowLeft, BarChart4, Clock, 
  Building, MapPin, Calendar 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Job } from "@/components/JobList";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, 
  PieChart, Pie, Cell, Tooltip 
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const CHART_COLORS = {
  primary: 'hsl(var(--primary))',
  primaryLight: 'hsl(var(--primary) / 0.8)',
  secondary: 'hsl(var(--secondary))',
  accent: 'hsl(var(--accent))',
  muted: 'hsl(var(--muted))',
  background: 'hsl(var(--background))',
  border: 'hsl(var(--border))',
};

const CHART_SERIES = [
  CHART_COLORS.primary,
  CHART_COLORS.primaryLight,
  CHART_COLORS.secondary,
  CHART_COLORS.accent,
  CHART_COLORS.muted,
];

const SessionDetails = () => {
  const params = useParams();
  const sessionId = params.slug as string;
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
			<div className={cn(
				"min-h-screen flex flex-col",
				"bg-gradient-to-b from-background to-secondary/20",
				"dark:from-background dark:to-secondary/10",
				"transition-colors duration-500"
			)}>
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
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<Skeleton className="h-32" />
							<Skeleton className="h-32" />
							<Skeleton className="h-32" />
						</div>
						<Skeleton className="h-64" />
						<Skeleton className="h-64" />
					</div>
				</main>
			</div>
		);
	}

	if (!sessionData) {
		return (
			<div className={cn(
				"min-h-screen flex flex-col",
				"bg-gradient-to-b from-background to-secondary/20",
				"dark:from-background dark:to-secondary/10",
				"transition-colors duration-500"
			)}>
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
							<Link href="/dashboard/scraper">
								<ArrowLeft className="mr-2 h-4 w-4" />
								Return to Scraper
							</Link>
						</Button>
					</div>
				</main>
			</div>
		);
	}

	const { query, jobs, timestamp, metrics } = sessionData;
	const formattedDate = new Date(timestamp).toLocaleString();
	
	// Calculate skills distribution
	const skillsDistribution = jobs.reduce((acc, job) => {
		if (job.skills) {
			job.skills.forEach(skill => {
				acc[skill] = (acc[skill] || 0) + 1;
			});
		}
		return acc;
	}, {} as Record<string, number>);
	
	const skillsChartData = Object.entries(skillsDistribution)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([name, value]) => ({ name, value }));
	
	// Calculate company distribution
	const companyDistribution = jobs.reduce((acc, job) => {
		acc[job.company] = (acc[job.company] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);
	
	const companyChartData = Object.entries(companyDistribution)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([name, value]) => ({ name, value }));
	
	// Calculate location distribution
	const locationDistribution = jobs.reduce((acc, job) => {
		acc[job.location] = (acc[job.location] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);
	
	const locationChartData = Object.entries(locationDistribution)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([name, value]) => ({ name, value }));
	
	// Calculate job type distribution
	const typeDistribution = jobs.reduce((acc, job) => {
		const type = job.type || "Other";
		acc[type] = (acc[type] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);
	
	const typeChartData = Object.entries(typeDistribution)
		.map(([name, value]) => ({ name, value }));
		
	// Calculate salary ranges
	const salaryRanges: Record<string, number> = {
		"< $80k": 0,
		"$80k - $100k": 0,
		"$100k - $120k": 0,
		"$120k - $140k": 0,
		"$140k - $160k": 0,
		"> $160k": 0
	};
	
	jobs.forEach(job => {
		const salaryString = job.salary || "";
		const salaryMatch = salaryString.match(/\$(\d+)k\s*-\s*\$(\d+)k/);
		
		if (salaryMatch) {
			const minSalary = parseInt(salaryMatch[1], 10);
			const maxSalary = parseInt(salaryMatch[2], 10);
			const avgSalary = (minSalary + maxSalary) / 2;
			
			if (avgSalary < 80) salaryRanges["< $80k"]++;
			else if (avgSalary < 100) salaryRanges["$80k - $100k"]++;
			else if (avgSalary < 120) salaryRanges["$100k - $120k"]++;
			else if (avgSalary < 140) salaryRanges["$120k - $140k"]++;
			else if (avgSalary < 160) salaryRanges["$140k - $160k"]++;
			else salaryRanges["> $160k"]++;
		}
	});
	
	const salaryChartData = Object.entries(salaryRanges)
		.map(([name, value]) => ({ name, value }));

	return (
		<div className={cn(
			"min-h-screen flex flex-col",
			"bg-gradient-to-b from-background via-background/80 to-background/40",
			"dark:from-background dark:via-background/60 dark:to-background/20",
			"transition-colors duration-500"
		)}>
			<header className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 dark:bg-background/80 border-b border-border/40 transition-colors duration-300">
				<div className="container flex items-center justify-between h-16 px-4 md:px-6">
					<div className="flex items-center gap-2 font-medium">
						<Briefcase className="w-5 h-5 text-primary" />
						<span className="text-xl">JobRover</span>
					</div>
					<ThemeToggle />
				</div>
			</header>
			
			<main className="flex-1 container py-8">
				<div className="mx-auto max-w-7xl">
					{/* Back button */}
					<div className="flex justify-between items-center mb-8">
						<Button 
							variant="outline" 
							asChild
							className="border-border/50 hover:bg-accent/50"
						>
							<Link href={`/dashboard/scraper/results/${sessionId}`}>
								<ArrowLeft className="mr-2 h-4 w-4" />
								Back to Results
							</Link>
						</Button>
					</div>
					
					<div className={cn(
						"mb-8 animate-in fade-in slide-in-from-bottom-5",
						"duration-500 fill-mode-forwards"
					)}>
						<h1 className={cn(
							"text-3xl font-bold mb-2",
							"bg-gradient-to-r from-foreground to-foreground/80",
							"dark:from-foreground dark:to-foreground/60",
							"bg-clip-text text-transparent"
						)}>
							Session Details
						</h1>
						<div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
							<span>Session ID: {sessionId}</span>
							<span>•</span>
							<span>Completed: {formattedDate}</span>
							<span>•</span>
							<span>Query: {query.jobTitle}</span>
							{query.location && (
								<>
									<span>•</span>
									<span>Location: {query.location}</span>
								</>
							)}
						</div>
					</div>
					
					{/* Key Metrics Summary */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
						<Card className={cn(
							"border-border/50 dark:border-border/30",
							"bg-card/50 dark:bg-card/40 backdrop-blur-sm",
							"hover:bg-card/60 dark:hover:bg-card/50",
							"transition-all duration-200",
							"animate-in fade-in slide-in-from-bottom-5",
							"duration-500 fill-mode-forwards"
						)}>
							<CardHeader className="pb-2">
								<CardDescription>Jobs Found</CardDescription>
								<CardTitle className="text-2xl font-medium flex items-center">
									<Briefcase className="w-4 h-4 mr-2 text-primary" />
									{metrics.totalJobs}
								</CardTitle>
							</CardHeader>
						</Card>
						<Card className={cn(
							"border-border/50 dark:border-border/30",
							"bg-card/50 dark:bg-card/40 backdrop-blur-sm",
							"hover:bg-card/60 dark:hover:bg-card/50",
							"transition-all duration-200",
							"animate-in fade-in slide-in-from-bottom-5",
							"duration-500 fill-mode-forwards"
						)}>
							<CardHeader className="pb-2">
								<CardDescription>Average Salary</CardDescription>
								<CardTitle className="text-2xl font-medium flex items-center">
									<Calendar className="w-4 h-4 mr-2 text-primary" />
									${metrics.averageSalary}k
								</CardTitle>
							</CardHeader>
						</Card>
						<Card className={cn(
							"border-border/50 dark:border-border/30",
							"bg-card/50 dark:bg-card/40 backdrop-blur-sm",
							"hover:bg-card/60 dark:hover:bg-card/50",
							"transition-all duration-200",
							"animate-in fade-in slide-in-from-bottom-5",
							"duration-500 fill-mode-forwards"
						)}>
							<CardHeader className="pb-2">
								<CardDescription>Companies</CardDescription>
								<CardTitle className="text-2xl font-medium flex items-center">
									<Building className="w-4 h-4 mr-2 text-primary" />
									{metrics.companies}
								</CardTitle>
							</CardHeader>
						</Card>
						<Card className={cn(
							"border-border/50 dark:border-border/30",
							"bg-card/50 dark:bg-card/40 backdrop-blur-sm",
							"hover:bg-card/60 dark:hover:bg-card/50",
							"transition-all duration-200",
							"animate-in fade-in slide-in-from-bottom-5",
							"duration-500 fill-mode-forwards"
						)}>
							<CardHeader className="pb-2">
								<CardDescription>Locations</CardDescription>
								<CardTitle className="text-2xl font-medium flex items-center">
									<MapPin className="w-4 h-4 mr-2 text-primary" />
									{metrics.locations}
								</CardTitle>
							</CardHeader>
						</Card>
					</div>
					
					{/* Performance Metrics */}
					<Card className={cn(
						"border-border/50 dark:border-border/30",
						"bg-card/50 dark:bg-card/40 backdrop-blur-sm",
						"hover:bg-card/60 dark:hover:bg-card/50",
						"transition-all duration-200",
						"animate-in fade-in slide-in-from-bottom-5",
						"duration-500 fill-mode-forwards"
					)}>
						<CardHeader>
							<div className="flex items-center">
								<Clock className="mr-2 h-4 w-4 text-primary" />
								<CardTitle>Performance Metrics</CardTitle>
							</div>
							<CardDescription>Scraping session performance details</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="flex flex-col">
									<span className="text-sm text-muted-foreground">Execution Time</span>
									<span className="text-2xl font-semibold">{(metrics.executionTimeMs / 1000).toFixed(2)}s</span>
								</div>
								<div className="flex flex-col">
									<span className="text-sm text-muted-foreground">Jobs Retrieved</span>
									<span className="text-2xl font-semibold">{metrics.totalJobs}</span>
								</div>
								<div className="flex flex-col">
									<span className="text-sm text-muted-foreground">Average Salary</span>
									<span className="text-2xl font-semibold">${metrics.averageSalary}k</span>
								</div>
							</div>
						</CardContent>
					</Card>
					
					{/* Skills Distribution */}
					<Card className={cn(
						"border-border/50 dark:border-border/30",
						"bg-card/50 dark:bg-card/40 backdrop-blur-sm",
						"hover:bg-card/60 dark:hover:bg-card/50",
						"transition-all duration-200",
						"animate-in fade-in slide-in-from-bottom-5",
						"duration-500 fill-mode-forwards"
					)}>
						<CardHeader>
							<div className="flex items-center">
								<BarChart4 className="mr-2 h-4 w-4 text-primary" />
								<CardTitle>Top Skills</CardTitle>
							</div>
							<CardDescription>Most in-demand skills from job listings</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2 mb-4">
								{skillsChartData.map((skill) => (
									<Badge key={skill.name} variant="secondary" className="text-sm">
										{skill.name} ({skill.value})
									</Badge>
								))}
							</div>
							<div className="h-64">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={skillsChartData}>
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip 
											contentStyle={{ 
												background: 'var(--background)', 
												border: '1px solid var(--border)',
												borderRadius: '6px' 
											}} 
										/>
										<Bar dataKey="value" fill="var(--primary)" name="Count" />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
					
					{/* Salary Distribution */}
					<Card className={cn(
						"border-border/50 dark:border-border/30",
						"bg-card/50 dark:bg-card/40 backdrop-blur-sm",
						"hover:bg-card/60 dark:hover:bg-card/50",
						"transition-all duration-200",
						"animate-in fade-in slide-in-from-bottom-5",
						"duration-500 fill-mode-forwards"
					)}>
						<CardHeader>
							<div className="flex items-center">
								<BarChart4 className="mr-2 h-4 w-4 text-primary" />
								<CardTitle>Salary Distribution</CardTitle>
							</div>
							<CardDescription>Distribution of salary ranges across jobs</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="h-64">
								<ResponsiveContainer width="100%" height="100%">
									<BarChart data={salaryChartData}>
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip 
											contentStyle={{ 
												background: 'var(--background)', 
												border: '1px solid var(--border)',
												borderRadius: '6px' 
											}} 
										/>
										<Bar dataKey="value" fill="var(--primary)" name="Jobs" />
									</BarChart>
								</ResponsiveContainer>
							</div>
						</CardContent>
					</Card>
					
					{/* Data Distribution */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
						{/* Companies Chart */}
						<Card className={cn(
							"border-border/50 dark:border-border/30",
							"bg-card/50 dark:bg-card/40 backdrop-blur-sm",
							"hover:bg-card/60 dark:hover:bg-card/50",
							"transition-all duration-200"
						)}>
							<CardHeader>
								<div className="flex items-center">
									<Building className="mr-2 h-4 w-4 text-primary" />
									<CardTitle>Companies</CardTitle>
								</div>
								<CardDescription>Top companies in search results</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="h-64">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={companyChartData}>
											<XAxis dataKey="name" />
											<YAxis />
											<Tooltip 
												contentStyle={{ 
													background: 'var(--background)', 
													border: '1px solid var(--border)',
													borderRadius: '6px' 
												}} 
											/>
											<Bar dataKey="value" fill="#3B82F6" name="Jobs" />
										</BarChart>
									</ResponsiveContainer>
								</div>
							</CardContent>
						</Card>
						
						{/* Locations Chart */}
						<Card className={cn(
							"border-border/50 dark:border-border/30",
							"bg-card/50 dark:bg-card/40 backdrop-blur-sm",
							"hover:bg-card/60 dark:hover:bg-card/50",
							"transition-all duration-200"
						)}>
							<CardHeader>
								<div className="flex items-center">
									<MapPin className="mr-2 h-4 w-4 text-primary" />
									<CardTitle>Locations</CardTitle>
								</div>
								<CardDescription>Top locations in search results</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="h-64">
									<ResponsiveContainer width="100%" height="100%">
										<BarChart data={locationChartData}>
											<XAxis dataKey="name" />
											<YAxis />
											<Tooltip 
												contentStyle={{ 
													background: 'var(--background)', 
													border: '1px solid var(--border)',
													borderRadius: '6px' 
												}} 
											/>
											<Bar dataKey="value" fill="#10B981" name="Jobs" />
										</BarChart>
									</ResponsiveContainer>
								</div>
							</CardContent>
						</Card>
						
						{/* Job Types Chart */}
						<Card className={cn(
							"border-border/50 dark:border-border/30",
							"bg-card/50 dark:bg-card/40 backdrop-blur-sm",
							"hover:bg-card/60 dark:hover:bg-card/50",
							"transition-all duration-200"
						)}>
							<CardHeader>
								<div className="flex items-center">
									<BarChart4 className="mr-2 h-4 w-4 text-primary" />
									<CardTitle>Job Types</CardTitle>
								</div>
								<CardDescription>Distribution of job types</CardDescription>
							</CardHeader>
							<CardContent className="flex justify-center">
								<div className="h-64 w-full max-w-md">
									<ResponsiveContainer width="100%" height="100%">
										<PieChart>
											<Pie
												data={typeChartData}
												cx="50%"
												cy="50%"
												labelLine={false}
												outerRadius={80}
												fill="#8884d8"
												dataKey="value"
												label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
											>
												{typeChartData.map((entry, index) => (
													<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
												))}
											</Pie>
											<Tooltip 
												contentStyle={{ 
													background: 'var(--background)', 
													border: '1px solid var(--border)',
													borderRadius: '6px' 
												}} 
												formatter={(value: any, name: any) => [`${value} jobs`, name]}
											/>
										</PieChart>
									</ResponsiveContainer>
								</div>
							</CardContent>
						</Card>
					</div>
					
					{/* Session Information */}
					<Card className={cn(
						"border-border/50 dark:border-border/30",
						"bg-card/50 dark:bg-card/40 backdrop-blur-sm",
						"hover:bg-card/60 dark:hover:bg-card/50",
						"transition-all duration-200"
					)}>
						<CardHeader>
							<CardTitle>Session Information</CardTitle>
							<CardDescription>Details about the scraping session</CardDescription>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader className="bg-muted/50 dark:bg-muted/20">
									<TableRow>
										<TableHead>Property</TableHead>
										<TableHead>Value</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell className="font-medium">Session ID</TableCell>
										<TableCell>{sessionId}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell className="font-medium">Timestamp</TableCell>
										<TableCell>{formattedDate}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell className="font-medium">Job Title</TableCell>
										<TableCell>{query.jobTitle}</TableCell>
									</TableRow>
									{query.location && (
										<TableRow>
											<TableCell className="font-medium">Location</TableCell>
											<TableCell>{query.location}</TableCell>
										</TableRow>
									)}
									{query.company && (
										<TableRow>
											<TableCell className="font-medium">Company</TableCell>
											<TableCell>{query.company}</TableCell>
										</TableRow>
									)}
									{query.websiteUrl && (
										<TableRow>
											<TableCell className="font-medium">Website URL</TableCell>
											<TableCell>{query.websiteUrl}</TableCell>
										</TableRow>
									)}
									<TableRow>
										<TableCell className="font-medium">Total Jobs</TableCell>
										<TableCell>{metrics.totalJobs}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell className="font-medium">Total Companies</TableCell>
										<TableCell>{metrics.companies}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell className="font-medium">Total Locations</TableCell>
										<TableCell>{metrics.locations}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell className="font-medium">Execution Time</TableCell>
										<TableCell>{(metrics.executionTimeMs / 1000).toFixed(2)} seconds</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
};

export default SessionDetails;
