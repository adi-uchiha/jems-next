
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Briefcase, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  location: z.string().optional(),
  company: z.string().optional(),
  websiteUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface ScraperFormProps {
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
}

export function ScraperForm({ onSubmit, isLoading }: ScraperFormProps) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: "",
      location: "",
      company: "",
      websiteUrl: "",
    },
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    toast({
      title: "Job scraping initiated",
      description: `Searching for ${values.jobTitle} jobs${values.location ? ` in ${values.location}` : ""}`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem className="animate-slide-up opacity-0" style={{ animationDelay: "0ms", animationFillMode: "forwards" }}>
                <FormLabel className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Job Title
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Software Engineer" 
                    {...field} 
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="animate-slide-up opacity-0" style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
                <FormLabel className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. San Francisco, CA" 
                    {...field} 
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem className="animate-slide-up opacity-0" style={{ animationDelay: "200ms", animationFillMode: "forwards" }}>
                <FormLabel className="flex items-center">
                  <svg 
                    className="w-4 h-4 mr-2" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M3 9v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9" />
                    <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                    <rect x="10" y="9" width="4" height="12" />
                  </svg>
                  Company
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Google" 
                    {...field} 
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="websiteUrl"
            render={({ field }) => (
              <FormItem className="animate-slide-up opacity-0" style={{ animationDelay: "300ms", animationFillMode: "forwards" }}>
                <FormLabel className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Website URL
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. https://company.com/careers" 
                    {...field} 
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full animate-slide-up opacity-0 transition-all duration-300 hover:shadow-lg"
          style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
        >
          {isLoading ? (
            <>
              <Search className="mr-2 h-4 w-4 animate-spin-slow" />
              Scraping...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Start Scraping
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
