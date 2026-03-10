import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchWidget from "@/components/SearchWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-white pb-20">
      <Navbar />
      <Hero />
      <SearchWidget />
      
      {/* Simple Footer/Bottom Padding */}
      <div className="mt-20 text-center text-gray-400 text-sm italic font-serif">
        The Starfruit — Stays you trust.
      </div>
    </main>
  );
}
