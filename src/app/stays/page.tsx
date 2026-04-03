import Navbar from "@/components/Navbar";
import SearchWidget from "@/components/SearchWidget";
import StaysSection from "@/components/StaysSection";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function StaysListingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Search Header Section with Cinematic Landscape Background */}
      <div className="relative pt-12 md:pt-16 pb-8 overflow-hidden min-h-[300px] md:min-h-[350px]">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/stays_search_landscape.png"
            alt="Search Background"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Soft White Overlay for readability */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
        </div>

        <div className="relative z-10">
          <SearchWidget isHero={false} />
        </div>
      </div>

      {/* Page Title & Description (Solid Background) */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-12 md:py-16 bg-white">
        <h1 className="text-[32px] md:text-[64px] font-serif text-gray-900 tracking-tight leading-tight text-center md:text-left">
          All Luxury Stays in Goa
        </h1>
        <p className="text-gray-500 mt-4 text-lg md:text-2xl max-w-2xl font-medium text-center md:text-left">
          Discover our curated collection of premium villas and apartments, vetted for excellence.
        </p>
      </div>

      <StaysSection viewMode="grid" />
      <Footer />
    </main>
  );
}
