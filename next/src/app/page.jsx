import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import GridSection from "@/components/GridSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-jnanagni-dark selection:bg-jnanagni-accent selection:text-black">
      <Navbar />
      <HeroSection />
      <GridSection title="EVENTS" id="events" />
      <GridSection title="ABOUT JNANAGNI" id="about" isReversed={true} />
      <Footer />
    </main>
  );
}