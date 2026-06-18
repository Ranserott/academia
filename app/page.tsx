import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { Roadmap } from "@/components/Roadmap";
import { Courses } from "@/components/Courses";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <Navbar />
      <main>
        <Hero />
        <Benefits />
        <Roadmap />
        <Courses />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
