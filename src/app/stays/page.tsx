import Navbar from "@/components/Navbar";
import SearchWidget from "@/components/SearchWidget";
import StaysSection from "@/components/StaysSection";
import Footer from "@/components/Footer";

export default function StaysListingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Search Header Section */}
      <div className="pt-8 md:pt-12 bg-gray-50/50 pb-12 border-b border-gray-100">
        <SearchWidget isHero={false} />
        
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 mt-12">
          <h1 className="text-[32px] md:text-[56px] font-serif text-gray-900 tracking-tight leading-tight">
            All Luxury Stays in Goa
          </h1>
          <p className="text-gray-500 mt-4 text-lg md:text-xl max-w-2xl">
            Discover our curated collection of premium villas and apartments, vetted for excellence.
          </p>
        </div>
      </div>

      <StaysSection viewMode="grid" />
      <Footer />
    </main>
  );
}
