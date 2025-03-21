'use client'
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "TechCorp",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    text: "JEMS completely transformed my job search. I spent months applying to positions manually before discovering this platform. Within two weeks of using JEMS, I received multiple interview requests and landed my dream job at TechCorp. The AI matching is incredibly accurate!"
  },
  {
    id: 2,
    name: "David Kim",
    role: "UX Designer",
    company: "DesignHub",
    avatar: "https://i.pravatar.cc/150?img=2",
    rating: 4,
    text: "As a designer looking to transition industries, I struggled to find relevant openings. JEMS not only found positions I wouldn't have discovered otherwise but also helped me understand which skills to highlight. The real-time alerts for new job postings are a game-changer."
  },
  {
    id: 3,
    name: "Alex Rivera",
    role: "Data Analyst",
    company: "DataViz Inc",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    text: "The chat assistant feature is what sets JEMS apart. Being able to ask questions and get personalized recommendations made my job search feel less overwhelming. I particularly appreciated how it helped me tailor my resume to specific opportunities."
  },
  {
    id: 4,
    name: "Emily Chen",
    role: "Product Manager",
    company: "InnoTech",
    avatar: "https://i.pravatar.cc/150?img=4",
    rating: 5,
    text: "After relocating to a new city, I needed to find a job quickly. JEMS streamlined everything, filtering out duplicate listings and focusing only on roles that matched my experience. The time-saving alone was worth it, but the quality of matches exceeded my expectations."
  },
  {
    id: 5,
    name: "Marcus Williams",
    role: "Marketing Specialist",
    company: "BrandForward",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 4,
    text: "I was skeptical about AI-powered job platforms, but JEMS proved me wrong. The recommendations were spot-on for my marketing background, and I loved being able to filter by company culture and benefits. Found my position at BrandForward within a month!"
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    // Auto-advance testimonials
    intervalRef.current = setInterval(() => {
      nextTestimonial();
    }, 8000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Add background effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.05]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/50 to-background" />
      
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            What Our Users Say
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Discover how JEMS has helped thousands of job seekers find their perfect position
            with less time and stress.
          </p>
        </div>

        <div className="relative px-4 sm:px-8">
          <div className="flex overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className={cn(
                  "w-full shrink-0 transition-all duration-500 transform",
                  "backdrop-blur-sm border-border/50 shadow-lg dark:shadow-primary/5",
                  "hover:shadow-xl hover:border-primary/20 dark:hover:border-primary/30",
                  index === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-95 absolute",
                )}
              >
                <CardContent className="pt-8 px-6">
                  <div className="flex justify-center mb-6">
                    <Avatar className="h-20 w-20 ring-2 ring-primary/20 dark:ring-primary/30">
                      <AvatarImage 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {testimonial.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5 transition-all duration-300",
                          i < testimonial.rating 
                            ? "text-primary fill-primary" 
                            : "text-muted-foreground/20"
                        )}
                      />
                    ))}
                  </div>

                  <blockquote className="text-lg text-foreground/90 italic mb-8 max-w-2xl mx-auto leading-relaxed">
                    "{testimonial.text}"
                  </blockquote>

                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8 gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  activeIndex === index 
                    ? "bg-primary scale-125" 
                    : "bg-primary/20 hover:bg-primary/40"
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2",
              "bg-background/80 backdrop-blur-sm border-border/50",
              "hover:bg-background hover:border-primary/20",
              "shadow-lg dark:shadow-primary/5"
            )}
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 translate-x-2",
              "bg-background/80 backdrop-blur-sm border-border/50",
              "hover:bg-background hover:border-primary/20",
              "shadow-lg dark:shadow-primary/5"
            )}
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
