import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchWidget from "@/components/SearchWidget";
import StaysSection from "@/components/StaysSection";
import StayTypesSection from "@/components/StayTypesSection";
import TravelerStories from "@/components/TravelerStories";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <SearchWidget />
      <StaysSection />
      <StayTypesSection />
      <TravelerStories />
      <FAQSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
