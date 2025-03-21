'use client';
import { useRef, useEffect, useState } from "react";
import { 
  Search, 
  MessageSquare, 
  FileText, 
  CheckCheck, 
  Mail, 
  RefreshCw, 
  Filter, 
  Award
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Search className="h-10 w-10 mb-4 text-primary" />,
    title: "Smart Job Matching",
    description: "Our AI analyzes your resume and preferences to find jobs that perfectly match your skills and experience."
  },
  {
    icon: <MessageSquare className="h-10 w-10 mb-4 text-primary" />,
    title: "Chat with JEMS",
    description: "Ask our AI assistant to find jobs, refine your search, or answer questions about potential opportunities."
  },
  {
    icon: <FileText className="h-10 w-10 mb-4 text-primary" />,
    title: "Resume Analysis",
    description: "Upload your resume once and let JEMS identify your key skills and suggest matching positions."
  },
  {
    icon: <RefreshCw className="h-10 w-10 mb-4 text-primary" />,
    title: "Real-Time Job Scraping",
    description: "We constantly scan top job boards to bring you the latest listings as soon as they're posted."
  },
  {
    icon: <Filter className="h-10 w-10 mb-4 text-primary" />,
    title: "Smart Filtering",
    description: "Say goodbye to duplicate listings and irrelevant positions with our intelligent filtering system."
  },
  {
    icon: <Mail className="h-10 w-10 mb-4 text-primary" />,
    title: "Job Alerts",
    description: "Get notified when new positions that match your profile become available."
  },
  {
    icon: <CheckCheck className="h-10 w-10 mb-4 text-primary" />,
    title: "Application Tracking",
    description: "Keep track of your applications, interviews, and follow-ups all in one place."
  },
  {
    icon: <Award className="h-10 w-10 mb-4 text-primary" />,
    title: "Career Insights",
    description: "Get valuable insights on salary ranges, required skills, and company information."
  }
];

const Features = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="features"
      ref={sectionRef} 
      className="py-24 bg-gradient-to-b from-background to-muted/30 dark:from-background dark:to-background relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Intelligent Features for a <span className="text-gradient">Smarter Job Search</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            JEMS combines cutting-edge AI with powerful job search tools to make finding your dream job faster and easier than ever.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={cn(
                "transition-all duration-700",
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-10",
                { "delay-100": index % 4 === 1 },
                { "delay-200": index % 4 === 2 },
                { "delay-300": index % 4 === 3 }
              )}
            >
              <Card className="h-full border border-border/40 bg-background/50 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="transition-transform duration-300 ease-in-out transform group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
