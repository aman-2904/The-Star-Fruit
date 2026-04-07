import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchWidget from "@/components/SearchWidget";
import StaysSection from "@/components/StaysSection";
import StayTypesSection from "@/components/StayTypesSection";
import TravelerStories from "@/components/TravelerStories";
import ContactSection from "@/components/ContactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import EnquirySection from "@/components/EnquirySection";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <SearchWidget />
      <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center text-gray-400">Loading stays...</div>}>
        <StaysSection />
      </Suspense>
      <ContactSection />
      <StayTypesSection />
      <EnquirySection />

      <TravelerStories />
      <FAQSection />


      <Footer />
    </main>
  );
}
