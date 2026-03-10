"use client";

import { useRef } from "react";
import Image from "next/image";
import StayCard from "./StayCard";
import CategoryFilters from "./CategoryFilters";
import { ChevronLeft, ChevronRight, ChevronDown, SlidersHorizontal, MapPin } from "lucide-react";

const northGoaStays = [
  {
    id: 1,
    title: "Casa Da Praia",
    location: "Assagao",
    description: "3 BHK Boutique Stay",
    rating: 4.8,
    image: "/images/stays/pool_villa.png",
  },
  {
    id: 2,
    title: "The Forest Glasshouse",
    location: "Siolim",
    description: "6 BHK Eco-Luxe",
    rating: 5.0,
    image: "/images/stays/forest_glasshouse.png",
    trending: true,
  },
  {
    id: 3,
    title: "Azure Bay Suite",
    location: "Dona Paula",
    description: "2 BHK Luxury Suite",
    rating: 4.7,
    image: "/images/stays/azure_suite.png",
  },
  {
    id: 4,
    title: "Beachfront Villa",
    location: "Anjuna",
    description: "5 BHK Ocean View",
    rating: 4.9,
    image: "/images/stays/beachfront.png",
  },
  {
    id: 5,
    title: "Azure Bay Suite",
    location: "Dona Paula",
    description: "2 BHK Luxury Suite",
    rating: 4.7,
    image: "/images/stays/azure_suite.png",
  },
  {
    id: 6,
    title: "Eco-Glasshouse",
    location: "Siolim",
    description: "4 BHK Forest retreat",
    rating: 4.9,
    image: "/images/stays/forest_glasshouse.png",
  },
  {
    id: 7,
    title: "Assagao Manor",
    location: "Assagao",
    description: "5 BHK Heritage Stay",
    rating: 4.8,
    image: "/images/stays/pool_villa.png",
  },
];

const southGoaStays = [
  {
    id: 8,
    title: "Heritage Portuguese Villa",
    location: "Cavelossim",
    description: "5 BHK Historic stay",
    rating: 4.9,
    image: "/images/stays/azure_suite.png",
    trending: true,
  },
  {
    id: 9,
    title: "Quiet Beachfront Hut",
    location: "Agonda",
    description: "1 BHK Eco-stay",
    rating: 4.7,
    image: "/images/stays/beachfront.png",
  },
  {
    id: 10,
    title: "Backwater Mansion",
    location: "Benaulim",
    description: "6 BHK Luxury estate",
    rating: 5.0,
    image: "/images/stays/pool_villa.png",
  },
  {
    id: 11,
    title: "Tropical Treehouse",
    location: "Colva",
    description: "2 BHK Unique stay",
    rating: 4.8,
    image: "/images/stays/forest_glasshouse.png",
  },
  {
    id: 12,
    title: "The Azure Retreat",
    location: "Majorda",
    description: "3 BHK Beach Villa",
    rating: 4.6,
    image: "/images/stays/azure_suite.png",
  },
  {
    id: 13,
    title: "Palolem Paradise",
    location: "Palolem",
    description: "4 BHK Ocean suite",
    rating: 4.9,
    image: "/images/stays/beachfront.png",
  },
];

interface Stay {
  id: number;
  title: string;
  location: string;
  description: string;
  rating: number;
  image: string;
  trending?: boolean;
}

const FilterDropdown = ({ label }: { label: string }) => (
  <button className="flex items-center gap-3 px-6 py-2.5 bg-[#FFF7F4] border border-[#FFD0B9] rounded-full text-[13px] md:text-[14px] font-bold text-gray-800 hover:bg-[#FFF2ED] transition-all group shadow-sm">
    {label}
    <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
  </button>
);

const StayCarousel = ({ title, stays }: { title: string, stays: Stay[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-[32px] md:text-[45px] font-serif text-gray-900 tracking-tight leading-tight">
          {title}
        </h2>
        <div className="flex gap-3 mb-2">
          <button
            onClick={() => scroll("left")}
            className="p-3.5 bg-gray-50/50 hover:bg-white rounded-full border border-gray-100 transition-all text-gray-400 hover:text-black hover:shadow-md active:scale-95"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-3.5 bg-gray-50/50 hover:bg-white rounded-full border border-gray-100 transition-all text-gray-400 hover:text-black hover:shadow-md active:scale-95"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar pb-10 -mx-4 px-4 md:-mx-0 md:px-0 scroll-smooth snap-x snap-mandatory"
      >
        {stays.map((stay: Stay) => (
          <StayCard key={stay.id} {...stay} />
        ))}
      </div>
    </div>
  );
};

const EnquirySection = () => (
  <div className="mt-16 relative w-full h-[400px] md:h-[550px] overflow-hidden group">
    <Image
      src="/images/stays/hotel.png"
      alt="Luxury Villa Goa"
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />

    <div className="absolute inset-x-8 md:inset-x-16 bottom-8 md:bottom-16 flex justify-between items-end">
      <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-2 text-white border border-white/30 shadow-xl transition-all hover:bg-white/30">
        <MapPin size={20} fill="white" />
        <span className="text-[15px] md:text-[18px] font-bold tracking-wide">Goa , India</span>
      </div>

      <button className="px-10 md:px-12 py-5 md:py-6 bg-white text-gray-900 rounded-full text-[15px] md:text-[18px] font-bold shadow-2xl transition-all hover:bg-gray-50 hover:scale-105 active:scale-95">
        Enquire Now
      </button>
    </div>
  </div>
);

export default function StaysSection() {
  return (
    <section className="pt-44 md:pt-32 pb-12 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        {/* Category Icons */}
        <CategoryFilters />

        {/* Property Filters Row */}
        <div className="flex flex-wrap items-center gap-4 mb-10 md:justify-center">
          <FilterDropdown label="Review Score" />
          <FilterDropdown label="Hotel Star" />
          <FilterDropdown label="Facilities" />
          <FilterDropdown label="Hotel Theme" />

          <button className="flex items-center gap-2.5 px-7 py-2.5 bg-[#FFF7F4] border border-[#FFD0B9] rounded-full text-[13px] md:text-[14px] font-bold text-gray-800 hover:bg-[#FFF2ED] transition-all shadow-sm">
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        <StayCarousel title="Top Rated Stays in North Goa" stays={northGoaStays} />
        <StayCarousel title="Stays in South Goa" stays={southGoaStays} />
      </div>

      <EnquirySection />
    </section>
  );
}
