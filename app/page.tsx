import Header from "@/components/layout/Header";
import Hero from "@/components/ui/hero";
import Partners from "@/components/ui/partners";
import Features from "@/components/ui/features";
import Process from "@/components/ui/process";
import Testimonials from "@/components/ui/testimonials";
import Cta from "@/components/ui/cta";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
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
}
