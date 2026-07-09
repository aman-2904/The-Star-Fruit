import { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Luxevillaz | #1 Best Villas in Goa at upto 70% off",
  description: "Tired of crowded hotels? Discover exclusive Villas in Goa with Luxevillaz for a stunning stay, private comfort, and memorable experiences. Reserve your dream villa today!",
  metadataBase: new URL("https://www.luxevillaz.com"),
  keywords: [
    "private pool villa in goa",
    "goa villas for rent",
    "villas in north goa",
    "villas in Goa",
    "Villas in Goa",
    "villas in south goa",
    "luxury villas in goa"
  ],
  alternates: {
    canonical: "https://www.luxevillaz.com",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Luxevillaz | #1 Best Villas in Goa at upto 70% off",
    description: "Tired of crowded hotels? Discover exclusive Villas in Goa with Luxevillaz for a stunning stay, private comfort, and memorable experiences. Reserve your dream villa today!",
    url: "https://www.luxevillaz.com",
    type: "website",
    images: [
      {
        url: "/images/host_cta_bg.webp",
        width: 1200,
        height: 630,
        alt: "Luxevillaz",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxevillaz | #1 Best Villas in Goa at upto 70% off",
    description: "Tired of crowded hotels? Discover exclusive Villas in Goa with Luxevillaz for a stunning stay, private comfort, and memorable experiences. Reserve your dream villa today!",
    images: ["/images/host_cta_bg.webp"],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Suspense fallback={null}>
        <SearchWidget />
      </Suspense>
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
