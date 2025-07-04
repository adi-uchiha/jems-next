'use client'
import { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter, ZAxis } from "recharts";
import { Activity, Briefcase, FileSpreadsheet, MessageSquare, SearchCheck, User, Settings, ChevronLeft, ChevronRight, BellIcon, LogOut, CalendarDays, TrendingUp, MapPin, Clock, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Footer from "@/components/layout/Footer";
import DashboardKpi from "@/components/dashboard/DashboardKpi";
import DashboardChart from "@/components/dashboard/DashboardChart";
import ScrapingSessionTable from "@/components/dashboard/ScrapingSessionTable";
import { useSidebar } from "@/components/dashboard/SidebarContext";

// Demo data
const jobsScrapedData = [
  { name: "Mon", jobs: 65 },
  { name: "Tue", jobs: 78 },
  { name: "Wed", jobs: 82 },
  { name: "Thu", jobs: 95 },
  { name: "Fri", jobs: 105 },
  { name: "Sat", jobs: 32 },
  { name: "Sun", jobs: 24 },
];

const jobSourcesData = [
  { name: "LinkedIn", value: 450, color: "#0077B5" },
  { name: "Indeed", value: 320, color: "#2164f3" },
  { name: "Glassdoor", value: 180, color: "#0CAA41" },
  { name: "ZipRecruiter", value: 140, color: "#5882E8" },
  { name: "Other", value: 90, color: "#95A5A6" },
];

const applicationStatusData = [
  { name: "Applied", value: 12, color: "#1E88E5" },
  { name: "Interviewed", value: 5, color: "#43A047" },
  { name: "Offer", value: 1, color: "#2CBAD1" },
  { name: "Rejected", value: 3, color: "#E53935" },
];

const topJobTitlesData = [
  { name: "Software Engineer", value: 45 },
  { name: "Data Scientist", value: 28 },
  { name: "Product Manager", value: 22 },
  { name: "UX Designer", value: 18 },
  { name: "Frontend Developer", value: 15 },
];

const chatInteractionsData = [
  { name: "Week 1", interactions: 12 },
  { name: "Week 2", interactions: 19 },
  { name: "Week 3", interactions: 15 },
  { name: "Week 4", interactions: 25 },
];

// New data for additional charts
const skillMatchData = [
  { skill: "JavaScript", user: 80, average: 65 },
  { skill: "React", user: 90, average: 60 },
  { skill: "Node.js", user: 70, average: 55 },
  { skill: "TypeScript", user: 85, average: 45 },
  { skill: "GraphQL", user: 65, average: 40 },
  { skill: "CSS", user: 75, average: 70 },
];

const jobsByLocationData = [
  { name: "Remote", value: 65, color: "#9C27B0" },
  { name: "New York", value: 15, color: "#FF9800" },
  { name: "San Francisco", value: 10, color: "#3F51B5" },
  { name: "Seattle", value: 5, color: "#009688" },
  { name: "Boston", value: 5, color: "#E91E63" },
];

const salaryRangeData = [
  { range: "$0-50k", count: 5 },
  { range: "$50-75k", count: 15 },
  { range: "$75-100k", count: 35 },
  { range: "$100-125k", count: 30 },
  { range: "$125-150k", count: 10 },
  { range: "$150k+", count: 5 },
];

const applicationTimelineData = [
  { month: "Jan", applications: 2, interviews: 1 },
  { month: "Feb", applications: 5, interviews: 2 },
  { month: "Mar", applications: 8, interviews: 3 },
  { month: "Apr", applications: 12, interviews: 6 },
  { month: "May", applications: 9, interviews: 4 },
  { month: "Jun", applications: 15, interviews: 7 },
];

const lineChartConfig = {
  jobs: { theme: { light: "#22C55E", dark: "#22C55E" }, label: "Jobs" },
  applications: { theme: { light: "#3B82F6", dark: "#3B82F6" }, label: "Applications" },
  interviews: { theme: { light: "#EC4899", dark: "#EC4899" }, label: "Interviews" }
};

const pieChartConfig = {
  linkedin: { theme: { light: "#0077B5", dark: "#0077B5" }, label: "LinkedIn" },
  indeed: { theme: { light: "#2164f3", dark: "#2164f3" }, label: "Indeed" },
  glassdoor: { theme: { light: "#0CAA41", dark: "#0CAA41" }, label: "Glassdoor" },
  ziprecruiter: { theme: { light: "#5882E8", dark: "#5882E8" }, label: "ZipRecruiter" },
  other: { theme: { light: "#95A5A6", dark: "#95A5A6" }, label: "Other" }
};

const barChartConfig = {
  applied: { theme: { light: "#1E88E5", dark: "#1E88E5" }, label: "Applied" },
  interviewed: { theme: { light: "#43A047", dark: "#43A047" }, label: "Interviewed" },
  offer: { theme: { light: "#2CBAD1", dark: "#2CBAD1" }, label: "Offer" },
  rejected: { theme: { light: "#E53935", dark: "#E53935" }, label: "Rejected" },
  user: { theme: { light: "#22C55E", dark: "#22C55E" }, label: "Your Skills" },
  average: { theme: { light: "#94A3B8", dark: "#94A3B8" }, label: "Market Average" }
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalEmbeddings: 0,
    failedJobs: 0,
    activeSessions: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
          <SearchCheck className="mr-2 h-4 w-4" />
          Start New Scraping Session
        </Button>
        <Button 
          variant="outline" 
          className="border-border/50 text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Update Preferences
        </Button>
        <Button 
          variant="outline" 
          className="border-border/50 text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          View Calendar
        </Button>
        <Button 
          variant="outline" 
          className="border-border/50 text-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Job Market Trends
        </Button>
      </div>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <DashboardKpi
          title="Total Jobs Scraped"
          value={stats.totalJobs.toString()}
          icon={SearchCheck}
          className="bg-card/30 backdrop-blur-sm border-border/30"
        />
        <DashboardKpi
          title="Total Embeddings"
          value={stats.totalEmbeddings.toString()}
          icon={FileSpreadsheet}
          className="bg-card/30 backdrop-blur-sm border-border/30"
        />
        <DashboardKpi
          title="Failed Jobs"
          value={stats.failedJobs.toString()}
          icon={Briefcase}
          className="bg-card/30 backdrop-blur-sm border-border/30"
        />
        <DashboardKpi
          title="Success Rate"
          value={`${stats.totalJobs > 0 ? ((stats.totalJobs - stats.failedJobs) / stats.totalJobs * 100).toFixed(1) : 0}%`}
          icon={Activity}
          className="bg-card/30 backdrop-blur-sm border-border/30"
        />
        <DashboardKpi
          title="Active Sessions"
          value={stats.activeSessions.toString()}
          icon={SearchCheck}
          description="Currently running"
          className="bg-card/30 backdrop-blur-sm border-border/30"
        />
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ScrapingSessionTable />
        
        <DashboardChart title="Jobs Scraped Daily" config={lineChartConfig}>
          <AreaChart data={jobsScrapedData}>
            <defs>
              <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', borderColor: '#333' }} />
            <Area type="monotone" dataKey="jobs" stroke="#22C55E" fillOpacity={1} fill="url(#colorJobs)" />
          </AreaChart>
        </DashboardChart>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardChart 
          title="Jobs by Source" 
          config={pieChartConfig}
          className="rounded-lg border border-border/50 dark:border-border/20 bg-card"
        >
          <PieChart>
            <Pie
              data={jobSourcesData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {jobSourcesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', borderColor: '#333' }} />
          </PieChart>
        </DashboardChart>
        
        <DashboardChart title="Application Progress" config={barChartConfig}>
          <BarChart data={applicationStatusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', borderColor: '#333' }} />
            <Bar dataKey="value">
              {applicationStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </DashboardChart>
        
        <DashboardChart title="Chat Interactions" config={lineChartConfig}>
          <LineChart data={chatInteractionsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', borderColor: '#333' }} />
            <Line type="monotone" dataKey="interactions" stroke="#22C55E" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </DashboardChart>
      </div>
      
      {/* Additional Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <DashboardChart title="Most Common Job Titles" config={barChartConfig}>
          <BarChart layout="vertical" data={topJobTitlesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis type="number" stroke="#888" />
            <YAxis dataKey="name" type="category" width={150} stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', borderColor: '#333' }} />
            <Bar dataKey="value" fill="#22C55E" />
          </BarChart>
        </DashboardChart>
        
        <DashboardChart title="Your Skills vs. Market Demand" config={barChartConfig}>
          <RadarChart outerRadius={90} width={500} height={250} data={skillMatchData}>
            <PolarGrid stroke="#444" />
            <PolarAngleAxis dataKey="skill" stroke="#888" />
            <PolarRadiusAxis stroke="#888" />
            <Radar name="Your Skills" dataKey="user" stroke="#22C55E" fill="#22C55E" fillOpacity={0.5} />
            <Radar name="Market Average" dataKey="average" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.3} />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', borderColor: '#333' }} />
          </RadarChart>
        </DashboardChart>
      </div>
      
      {/* Additional Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <DashboardChart title="Jobs by Location" config={pieChartConfig}>
          <PieChart>
            <Pie
              data={jobsByLocationData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {jobsByLocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', borderColor: '#333' }} />
          </PieChart>
        </DashboardChart>
        
        <DashboardChart title="Salary Distribution" config={barChartConfig}>
          <BarChart data={salaryRangeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="range" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', borderColor: '#333' }} />
            <Bar dataKey="count" fill="#9C27B0" />
          </BarChart>
        </DashboardChart>
        
        <DashboardChart title="Application Timeline" config={lineChartConfig}>
          <LineChart data={applicationTimelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', borderColor: '#333' }} />
            <Line type="monotone" dataKey="applications" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="interviews" stroke="#EC4899" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </DashboardChart>
      </div>
      
      {/* Resume Match Gauge */}
      <div className="mt-6">
        <DashboardChart title="Resume Match Percentage" config={lineChartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2 text-primary">68%</div>
                <div className="flex justify-center mb-4">
                  <div className="w-64 h-4 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500" style={{width: '68%'}}></div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Average match percentage</p>
                <div className="flex gap-8 mt-2 justify-center">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-red-500">45%</div>
                    <p className="text-xs text-muted-foreground">Minimum</p>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-semibold text-green-500">92%</div>
                    <p className="text-xs text-muted-foreground">Maximum</p>
                  </div>
                </div>
              </div>
            </div>
          </ResponsiveContainer>
        </DashboardChart>
      </div>
    </div>
  );
};

export default Dashboard;
