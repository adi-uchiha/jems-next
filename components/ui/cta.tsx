'use client';
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    
    const colors = [
      'hsl(var(--primary))',
      'hsl(var(--secondary))',
      'hsl(var(--accent))',
      'hsl(var(--muted))',
      'hsl(var(--primary))'
    ]; // Updated confetti colors to use theme variables
    
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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
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
    <motion.section
      id="cta"
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80" />
      
      <div className="container mx-auto px-6">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border border-border/50 bg-background/50 backdrop-blur-sm">
            {showConfetti && <ConfettiExplosion onComplete={() => setShowConfetti(false)} />}
            
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  variants={fadeInUp}
                  transition={{ delay: 0.2 }}
                >
                  <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-secondary/10">
                    <span className="text-sm font-medium text-secondary-foreground">
                      Limited Time Offer
                    </span>
                  </div>
                  
                  <motion.h2 
                    className="text-3xl font-bold tracking-tight mb-6"
                    variants={fadeInUp}
                    transition={{ delay: 0.3 }}
                  >
                    Ready to Find Your{" "}
                    <span className="text-primary">Dream Job</span>?
                  </motion.h2>
                  
                  <motion.p 
                    className="text-muted-foreground text-lg mb-8"
                    variants={fadeInUp}
                    transition={{ delay: 0.4 }}
                  >
                    Join thousands of professionals who've already used JEMS to land their perfect position.
                  </motion.p>
                  
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8"
                    variants={fadeInUp}
                    transition={{ delay: 0.5 }}
                  >
                    {[
                      "Resume analysis included",
                      "Unlimited job matches",
                      "AI Chat assistant",
                      "Real-time job alerts"
                    ].map((feature, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center gap-2"
                        variants={fadeInUp}
                        transition={{ delay: 0.2 * index }}
                      >
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
                
                <AnimatePresence mode="wait">
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="bg-card p-8 rounded-lg border border-border/50"
                    >
                      <motion.div 
                        className="text-center"
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="mx-auto mb-6">
                          <CheckCircle className="h-12 w-12 text-primary mx-auto" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">You're All Set!</h3>
                        <p className="text-muted-foreground mb-6">
                          Check your email for login details.
                        </p>
                        <Button
                          onClick={() => setIsSubmitted(false)}
                          variant="outline"
                        >
                          Back to Form
                        </Button>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="bg-card p-8 rounded-lg border border-border/50"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Cta;
