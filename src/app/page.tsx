import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchWidget from "@/components/SearchWidget";
import StaysSection from "@/components/StaysSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <SearchWidget />
      <StaysSection />
      
      {/* Simple Footer/Bottom Padding */}
      <div className="pb-24 pt-10 text-center text-gray-400 text-sm italic font-serif bg-gray-50/20">
        The Starfruit — Stays you trust.
      </div>
    </main>
  );
}
