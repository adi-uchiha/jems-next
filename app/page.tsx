
import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Hero from "@/components/ui/hero";
import Partners from "@/components/ui/partners";
import Features from "@/components/ui/features";
import Process from "@/components/ui/process";
import Testimonials from "@/components/ui/testimonials";
import Cta from "@/components/ui/cta";
import Footer from "@/components/layout/Footer";

const Index = () => {
  useEffect(() => {
    // Set page metadata
    document.title = "JEMS - AI-Powered Job Finding Assistant";
    
    // Initialize analytics tracking (could be connected to a real analytics service)
    console.log("Page view tracked: Home");
    
    // Implement error boundary
    window.addEventListener("error", (event) => {
      console.error("Global error caught:", event.error);
      // This could send errors to a monitoring service
    });
    
    return () => {
      window.removeEventListener("error", () => {});
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col antialiased">
      <Header />
      
      <main>
        <Hero />
        <Partners />
        <Features />
        <Process />
        <Testimonials />
        <Cta />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
