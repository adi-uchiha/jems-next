'use client'
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Search, Briefcase, Users } from "lucide-react";

const TypeWriterText = ({ text, delay = 100 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, delay);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);
  
  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4">
      {displayedText}
      <span className="animate-pulse">|</span>
    </h1>
  );
};

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);
  
  useEffect(() => {
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      if (heroRef.current) {
        observer.unobserve(heroRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="min-h-[calc(100vh-4rem)] relative overflow-hidden py-20 flex items-center"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Animated background elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-3 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              AI-Powered Job Search
            </div>
            
            <TypeWriterText text="Find Your Dream Job with JEMS" />
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md">
              Upload your resume, set your preferences, and let our AI find the perfect job matches tailored to your skills and experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                See How It Works
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-primary-foreground text-xs">A</div>
                <div className="w-8 h-8 rounded-full bg-primary/60 flex items-center justify-center text-primary-foreground text-xs">B</div>
                <div className="w-8 h-8 rounded-full bg-primary/40 flex items-center justify-center text-primary-foreground text-xs">C</div>
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-foreground text-xs">D</div>
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">10,000+</span> professionals found jobs last month
              </p>
            </div>
          </div>
          
          <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm shadow-xl relative">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-primary/5 to-primary/2 pointer-events-none" />
              
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">AI Job Assistant</h3>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-background/80 p-4 rounded-lg border border-border/40">
                    <p className="text-sm text-muted-foreground mb-2">Chat with JEMS</p>
                    <p className="font-medium text-foreground">Find me remote software engineer jobs that match my resume</p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-lg border border-border/40">
                    <div className="flex gap-2 mb-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium text-foreground">Found 28 matches</p>
                    </div>
                    <p className="text-sm mb-3 text-muted-foreground">Here are the top 3 matches based on your skills:</p>
                    
                    <ul className="space-y-2">
                      <li className="text-sm p-2 bg-background/80 rounded border border-border/40">
                        <div className="font-medium text-foreground">Senior Frontend Engineer</div>
                        <div className="text-xs text-muted-foreground">TechCorp • Remote • $130-150K</div>
                      </li>
                      <li className="text-sm p-2 bg-background/80 rounded border border-border/40">
                        <div className="font-medium text-foreground">React Developer</div>
                        <div className="text-xs text-muted-foreground">StartupXYZ • Remote • $110-130K</div>
                      </li>
                      <li className="text-sm p-2 bg-background/80 rounded border border-border/40">
                        <div className="font-medium text-foreground">Full Stack Engineer</div>
                        <div className="text-xs text-muted-foreground">InnovateCo • Remote • $120-140K</div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Personalized for you</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    View all matches
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
