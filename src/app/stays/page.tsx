import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SearchWidget from "@/components/SearchWidget";
import StaysSection from "@/components/StaysSection";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import fs from "fs";
import path from "path";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const type = resolvedSearchParams.type;

  if (type === "Hotel,Apartment" || (typeof type === "string" && type.includes("Hotel") && type.includes("Apartment"))) {
    const title = "Luxury Apartments in Goa | Premium Stays by LuxeVillaz";
    const description = "Explore fully furnished apartments in Goa with LuxeVillaz. Enjoy verified stays, premium amenities, flexible booking options, and unforgettable experiences for every travel";
    const url = "https://www.luxevillaz.com/stays?type=Hotel,Apartment";

    return {
      title,
      description,
      metadataBase: new URL("https://www.luxevillaz.com"),
      keywords: [
        "Luxevillaz",
        "Luxevillaz Goa",
        "Apartments in Goa",
        "Luxury Apartments in Goa",
        "Serviced Apartments in Goa",
        "Holiday Apartments in Goa",
        "Vacation Apartments in Goa",
        "Best Apartments in Goa",
        "Goa Apartment Rentals",
        "Luxury Apartment Rentals Goa",
        "Beachside Apartments in Goa",
        "Furnished Apartments in Goa",
        "Family Apartments in Goa",
        "Couple Friendly Apartments in Goa",
        "Apartments Near Beach in Goa",
        "Short Stay Apartments Goa",
        "Premium Apartments in Goa",
        "Book Apartments in Goa",
        "Goa Holiday Apartments",
        "Luxury Stays in Goa"
      ],
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        type: "website",
        images: [
          {
            url: "/images/cat_resort.png",
            width: 1200,
            height: 630,
            alt: "Luxury Apartments in Goa",
          }
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/images/cat_resort.png"],
      },
    };
  }

  if (type === "Villa" || (typeof type === "string" && type.split(',').includes("Villa"))) {
    const title = "Luxury Villas in Goa for Rent | Private Pool Villas by LuxeVillaz";
    const description = "Book exclusive private pool villas in Goa with LuxeVillaz. Enjoy verified stays, premium amenities, private pools, flexible booking, and customized hosting support.";
    const url = "https://www.luxevillaz.com/stays?type=Villa";

    return {
      title,
      description,
      metadataBase: new URL("https://www.luxevillaz.com"),
      keywords: [
        "Luxevillaz",
        "Luxevillaz Goa",
        "Villas in Goa",
        "Villas in Goa for rent",
        "Private pool villas in Goa",
        "Luxury villas in Goa",
        "Rent villa in Goa",
        "Best villas in Goa",
        "Villas in North Goa",
        "Villas in South Goa",
        "Luxury stays in Goa"
      ],
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        type: "website",
        images: [
          {
            url: "/images/host_hero.png",
            width: 1200,
            height: 630,
            alt: "Luxury Villas in Goa",
          }
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/images/host_hero.png"],
      },
    };
  }

  return {
    title: "Luxury Stays in Goa | Premium Villas & Apartments by LuxeVillaz",
    description: "Discover exclusive luxury stays, premium pool villas, serviced apartments, and vacation rentals in Goa with LuxeVillaz.",
    metadataBase: new URL("https://www.luxevillaz.com"),
    alternates: {
      canonical: "https://www.luxevillaz.com/stays",
    },
  };
}

export default async function StaysListingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const rawType = resolvedSearchParams.type;
  const type = typeof rawType === "string" ? rawType : undefined;

  // Check which background image exists
  const hasVillaBg = fs.existsSync(path.join(process.cwd(), "public", "images", "villa_search_bg.png"));
  const hasStaysBg = fs.existsSync(path.join(process.cwd(), "public", "images", "stays_search_bg.png"));

  const isVilla = type === "Villa" || (typeof type === "string" && type.split(',').includes("Villa"));
  const isCruise = type === "Cruise";

  let bgImage = "/images/stays_search_landscape.png";
  if (isCruise) {
    bgImage = "/images/stay_cruise.png";
  } else if (isVilla) {
    bgImage = "/images/villa_search_bg.png";
  } else {
    bgImage = hasStaysBg ? "/images/stays_search_bg.png" : "/images/stays_search_landscape.png";
  }

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Search Header Section with Cinematic Landscape Background */}
        <div className="relative pt-12 md:pt-16 pb-8 overflow-hidden min-h-[300px] md:min-h-[350px]">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <Image
              src={bgImage}
              alt="Search Background"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Soft White Overlay for readability */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
          </div>

          <div className="relative z-10">
            <Suspense fallback={null}>
              <SearchWidget isHero={false} />
            </Suspense>
          </div>
        </div>

        {!isCruise ? (
          <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center text-gray-400">Loading stays...</div>}>
            <StaysSection
              viewMode="grid"
              listingTitle={isVilla ? "All Luxury Villas in Goa" : "All Luxury Stays in Goa"}
              listingDescription={isVilla ? "Discover our curated collection of premium private villas, vetted for excellence." : "Discover our curated collection of premium villas and apartments, vetted for excellence."}
            />
          </Suspense>
        ) : (
          /* Elegant bottom spacing to position footer beautifully */
          <div className="py-20 md:py-32"></div>
        )}
      </div>
      <Footer />
    </main>
  );
}

