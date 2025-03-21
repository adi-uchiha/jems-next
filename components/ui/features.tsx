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
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Search className="h-10 w-10 text-primary" />,
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
      className="py-24 relative overflow-hidden bg-background/50 dark:bg-background/40"
    >
      <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.05]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />
      
      <div className="container relative z-10 mx-auto px-4">
        <div 
          className={cn(
            "text-center max-w-3xl mx-auto mb-16 transition-all duration-700 transform",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <h2 className="text-4xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Powered by AI, Built for You
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Experience the future of job searching with our advanced features
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={cn(
                "group relative overflow-hidden border border-border/50",
                "backdrop-blur-sm hover:shadow-lg transition-all duration-500",
                "hover:scale-105 hover:bg-primary/5 hover:border-primary/20",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
                `transition-all duration-700 delay-[${index * 100}ms]`
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 p-6">
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
