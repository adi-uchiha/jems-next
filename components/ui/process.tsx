
import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Upload, Settings, Search, Check } from "lucide-react";

const steps = [
  {
    icon: <Upload className="h-8 w-8 text-primary" />,
    title: "Upload Your Resume",
    description: "Start by uploading your resume. Our AI will analyze your skills, experience, and qualifications.",
    detail: "JEMS extracts key information from your resume using advanced natural language processing. It identifies your skills, years of experience, education, and previous roles to create a comprehensive profile."
  },
  {
    icon: <Settings className="h-8 w-8 text-primary" />,
    title: "Set Your Preferences",
    description: "Tell us what you're looking for in your next role – job title, location, salary, and more.",
    detail: "Customize your job search by specifying your desired job titles, industry preferences, location requirements (including remote options), salary expectations, and company size preferences. The more details you provide, the better we can match you with suitable positions."
  },
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "AI Finds Matching Jobs",
    description: "Our AI searches thousands of job listings in real-time to find positions that match your profile.",
    detail: "JEMS scrapes job listings from LinkedIn, Indeed, Glassdoor, and company career pages. Our algorithms filter out duplicate listings and rank positions based on how well they match your skills and preferences, ensuring you only see relevant opportunities."
  },
  {
    icon: <Check className="h-8 w-8 text-primary" />,
    title: "Apply with Confidence",
    description: "Review your personalized job matches and apply to the opportunities that interest you most.",
    detail: "For each job match, JEMS provides a compatibility score showing how well your profile aligns with the position. You can chat with our AI assistant to get more insights about specific roles or companies before applying."
  }
];

const Process = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
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
  
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => {
          const nextStep = (prev + 1) % steps.length;
          setProgress((nextStep / (steps.length - 1)) * 100);
          return nextStep;
        });
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="py-24 relative overflow-hidden bg-muted/30 dark:bg-slate-950/50"
    >
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            How <span className="text-gradient">JEMS</span> Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Your job hunt, reinvented with AI-powered simplicity and precision.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          )}>
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-4 p-6 rounded-lg transition-all duration-300",
                    activeStep === index
                      ? "bg-background shadow-md border border-primary/20"
                      : "opacity-70"
                  )}
                  onClick={() => {
                    setActiveStep(index);
                    setProgress((index / (steps.length - 1)) * 100);
                  }}
                >
                  <div
                    className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                      activeStep === index
                        ? "bg-primary/10"
                        : "bg-muted"
                    )}
                  >
                    {step.icon}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                    
                    <div
                      className={cn(
                        "mt-4 text-sm text-muted-foreground overflow-hidden transition-all",
                        activeStep === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                      )}
                    >
                      {step.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
          
          <div className={cn(
            "transition-all duration-700 delay-300",
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          )}>
            <Card className="overflow-hidden border border-border/40 bg-background/50 backdrop-blur-sm shadow-lg">
              <div className="p-1">
                <div className="rounded-md overflow-hidden">
                  <div className="h-8 bg-muted flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="text-xs text-muted-foreground ml-2">JEMS Assistant</div>
                  </div>
                  
                  <div className="bg-background dark:bg-slate-900 p-6">
                    <div className="space-y-4">
                      <div className="p-3 bg-muted/50 rounded-lg rounded-tl-none max-w-[80%]">
                        <p className="text-sm">Hi there! I'm your JEMS assistant. How can I help with your job search today?</p>
                      </div>
                      
                      <div className="p-3 bg-primary/10 rounded-lg rounded-tr-none ml-auto max-w-[80%]">
                        <p className="text-sm">I'm looking for remote software engineer positions that match my skills in React and Node.js.</p>
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded-lg rounded-tl-none max-w-[80%]">
                        <p className="text-sm">Great! Based on your resume, I found 24 matching positions. The top 3 matches are:</p>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• Senior Frontend Developer at TechCorp (98% match)</li>
                          <li>• Full Stack Engineer at StartupXYZ (92% match)</li>
                          <li>• React Developer at InnovateCo (89% match)</li>
                        </ul>
                        <p className="mt-2 text-sm">Would you like to see more details about any of these positions?</p>
                      </div>
                      
                      {activeStep >= 2 && (
                        <div className="p-3 bg-primary/10 rounded-lg rounded-tr-none ml-auto max-w-[80%] animate-fade-in">
                          <p className="text-sm">Yes, tell me more about the Senior Frontend Developer role.</p>
                        </div>
                      )}
                      
                      {activeStep >= 3 && (
                        <div className="p-3 bg-muted/50 rounded-lg rounded-tl-none max-w-[80%] animate-fade-in">
                          <p className="text-sm font-medium">Senior Frontend Developer at TechCorp</p>
                          <p className="text-sm mt-1">• Salary range: $120K - $150K</p>
                          <p className="text-sm">• Remote (US-based)</p>
                          <p className="text-sm">• 5+ years of experience required (you have 6)</p>
                          <p className="text-sm">• Required skills: React, TypeScript, GraphQL (all found in your resume)</p>
                          <p className="text-sm mt-2">Would you like to apply for this position?</p>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 border-t border-border pt-4 mt-6">
                        <input
                          type="text"
                          className="w-full bg-muted/30 text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary border border-border/40"
                          placeholder="Type your question here..."
                          disabled={activeStep < 3}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
