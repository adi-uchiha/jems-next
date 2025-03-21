'use client'
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Search, Briefcase, Users, CheckCircle, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

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
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    if (heroRef.current) {
      observer.observe(heroRef.current);
    }
    
    return () => {
      if (heroRef.current) observer.unobserve(heroRef.current);
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="min-h-[calc(100vh-4rem)] relative overflow-hidden py-20 flex items-center"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.05]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              AI-Powered Job Search
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Find Your Dream Job with{" "}
              <span className="text-primary">JEMS</span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col gap-4 mb-8 text-muted-foreground"
            >
              <p className="text-lg">
                Upload your resume, set your preferences, and let our AI find the perfect job matches
              </p>
              <div className="flex flex-col sm:flex-row gap-2 items-center justify-center lg:justify-start text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Smart Job Matching</span>
                </div>
                <div className="hidden sm:block text-muted-foreground">•</div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Resume Analysis</span>
                </div>
                <div className="hidden sm:block text-muted-foreground">•</div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>AI Chat Assistant</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button size="lg" className="h-12 px-6">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-6">
                Learn More
                <ArrowDown className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex items-center gap-4 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-xs font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">10,000+</span> professionals joined last month
              </p>
            </motion.div>
          </motion.div>

          {/* Right Content - Chat Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <Card className="overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm">
              <div className="p-1">
                <div className="rounded-lg overflow-hidden">
                  <div className="h-8 bg-muted flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="text-xs text-muted-foreground ml-2">JEMS Assistant</div>
                  </div>
                  
                  <div className="bg-card p-6 space-y-4">
                    <div className="p-3 bg-muted/50 rounded-lg rounded-tl-none max-w-[80%]">
                      <p className="text-sm">Welcome! I can help you find the perfect job. What kind of position are you looking for?</p>
                    </div>
                    
                    <div className="p-3 bg-primary/10 rounded-lg rounded-tr-none ml-auto max-w-[80%]">
                      <p className="text-sm">I'm looking for remote software engineer positions.</p>
                    </div>
                    
                    <div className="p-3 bg-muted/50 rounded-lg rounded-tl-none max-w-[80%]">
                      <p className="text-sm">Great! I found several matches based on your profile:</p>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• Senior Frontend Engineer at TechCorp</li>
                        <li>• Full Stack Developer at StartupX</li>
                        <li>• React Developer at InnovateHub</li>
                      </ul>
                    </div>
                    
                    <div className="flex items-center gap-2 border-t border-border/40 pt-4">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        className="w-full bg-muted/30 text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Decorative Elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
