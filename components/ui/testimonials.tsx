
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
    <section id="testimonials" className="section-padding bg-muted/50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Discover how JEMS has helped thousands of job seekers find their perfect position
          with less time and stress.
        </p>

        <div className="relative">
          <div className="flex overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className={cn(
                  "w-full shrink-0 transition-all duration-500 transform",
                  index === activeIndex ? "opacity-100 scale-100" : "opacity-0 scale-95 absolute"
                )}
              >
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-20 w-20 border-2 border-primary">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>

                  <blockquote className="text-lg italic mb-6 max-w-2xl mx-auto">
                    "{testimonial.text}"
                  </blockquote>

                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <Star
                key={index}
                className={cn(
                  "h-3 w-3 cursor-pointer",
                  activeIndex === index ? "text-primary fill-primary" : "text-muted-foreground"
                )}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:translate-x-0 bg-background/80 shadow-sm hover:bg-background"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-0 bg-background/80 shadow-sm hover:bg-background"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
