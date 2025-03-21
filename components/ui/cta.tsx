
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const ConfettiExplosion = ({ onComplete }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    if (!ctx) return;
    
    const colors = ['#2563EB', '#22C55E', '#EC4899', '#EAB308', '#8B5CF6'];
    
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < 200; i++) {
        const size = Math.random() * 8 + 2;
        particles.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          size,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20 - 5,
          gravity: 0.2,
          opacity: 1
        });
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let complete = true;
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.opacity -= 0.01;
        
        if (p.opacity > 0) {
          complete = false;
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      ctx.globalAlpha = 1;
      
      if (complete) {
        cancelAnimationFrame(animationFrameId);
        if (onComplete) onComplete();
        return;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    createParticles();
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
};

const Cta = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setShowConfetti(true);
      setTimeout(() => {
        setIsSubmitted(true);
      }, 300);
    }
  };

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className={cn(
          "transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <Card className="border border-border/40 bg-background/50 backdrop-blur-sm overflow-hidden relative animate-float">
            {/* Gradient border effect */}
            <div className="absolute inset-0 p-[1px] rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 animate-pulse" />
            </div>
            
            {showConfetti && <ConfettiExplosion onComplete={() => setShowConfetti(false)} />}
            
            <CardContent className="p-8 md:p-12 relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="flex items-center px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium inline-block mb-6">
                    <span className="flex h-2 w-2 rounded-full bg-secondary mr-2"></span>
                    Limited Time Offer
                  </div>
                  
                  <h2 className="text-3xl font-bold tracking-tight mb-6">
                    Ready to Find Your <span className="text-gradient">Dream Job</span>?
                  </h2>
                  
                  <p className="text-muted-foreground text-lg mb-8">
                    Join thousands of professionals who've already used JEMS to land their perfect position. Sign up now and get your first month free.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    {[
                      "Resume analysis included",
                      "Unlimited job matches",
                      "AI Chat assistant",
                      "Real-time job alerts"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="w-1/3 h-2 rounded-full bg-secondary"></div>
                      <div className="w-1/4 h-2 rounded-full bg-primary"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-1/5 h-2 rounded-full bg-primary"></div>
                      <div className="w-1/3 h-2 rounded-full bg-secondary"></div>
                      <div className="w-1/6 h-2 rounded-full bg-primary"></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-background/80 dark:bg-background/20 p-8 rounded-lg border border-border/40 backdrop-blur-sm">
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="h-8 w-8 text-secondary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">You're All Set!</h3>
                      <p className="text-muted-foreground mb-6">
                        Check your email for login details to start your job search journey with JEMS.
                      </p>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                      >
                        Back to Form
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold mb-4">Get Started Free</h3>
                      <p className="text-muted-foreground mb-6">
                        Join JEMS today and find your perfect job match. No credit card required.
                      </p>
                      
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="text-sm font-medium block mb-1">Full Name</label>
                          <Input 
                            id="name"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="text-sm font-medium block mb-1">Email Address</label>
                          <Input 
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="job-title" className="text-sm font-medium block mb-1">Current Job Title</label>
                          <Input 
                            id="job-title"
                            placeholder="Software Engineer"
                            required
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full bg-primary hover:bg-primary/90 text-white group"
                        >
                          Get Started Now
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </form>
                      
                      <p className="text-xs text-muted-foreground mt-6 text-center">
                        By signing up, you agree to our Terms of Service and Privacy Policy.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Cta;
