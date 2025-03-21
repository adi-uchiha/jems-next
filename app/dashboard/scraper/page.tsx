'use client'

import { ThemeToggle } from "@/components/theme-toggle";
import { JobScraper } from "@/components/JobScraper";
import { Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const ScrapePage = () => {
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      "bg-gradient-to-b from-background to-muted/20",
      "dark:from-background dark:to-muted/10",
      "transition-colors duration-500"
    )}>
      <header className={cn(
        "sticky top-0 z-10",
        "backdrop-blur-lg bg-background/80 dark:bg-background/80",
        "border-b border-border/40",
        "transition-colors duration-300"
      )}>
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            <span className={cn(
              "text-xl font-semibold tracking-tight",
              "text-foreground dark:text-foreground"
            )}>
              JEMS Scraper
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 container px-4 py-8 md:py-12 md:px-6 lg:py-16">
        <div className="mx-auto max-w-5xl">
          <section className="mb-12 text-center animate-fade-in">
            <h1 className={cn(
              "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-3",
              "bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent",
              "dark:from-primary dark:to-primary/80"
            )}>
              Find Your Next Career Opportunity
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful job scraping tool to discover opportunities across the web
            </p>
          </section>
          
          <JobScraper 
            className={cn(
              "animate-slide-up opacity-0",
              "border border-border/50 dark:border-border/30",
              "bg-card/50 dark:bg-card/40",
              "backdrop-blur-sm"
            )} 
            style={{ 
              animationDelay: "300ms", 
              animationFillMode: "forwards" 
            }} 
          />
        </div>
      </main>
      
      <footer className={cn(
        "border-t border-border/40",
        "py-6 backdrop-blur-lg",
        "bg-background/80 dark:bg-background/80",
        "transition-colors duration-300"
      )}>
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} JEMS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ScrapePage;
