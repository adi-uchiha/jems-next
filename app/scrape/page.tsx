'use client'
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { JobScraper } from "@/components/JobScraper";
import { Briefcase } from "lucide-react";

const Index = () => {
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
            <section className="mb-12 text-center animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-3">
                Find Your Next Career Opportunity
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful job scraping tool to discover opportunities across the web
              </p>
            </section>
            
            <JobScraper className="animate-slide-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }} />
          </div>
        </main>
        
        <footer className="border-t border-border/40 py-6 backdrop-blur-lg bg-background/80 dark:bg-background/80 transition-colors duration-300">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} JobRover. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Index;
