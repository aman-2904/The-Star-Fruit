"use client";

import { useRef } from "react";
import StayCard from "./StayCard";
import CategoryFilters from "./CategoryFilters";
import { ChevronLeft, ChevronRight, ChevronDown, SlidersHorizontal } from "lucide-react";

const stays = [
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
];

const FilterDropdown = ({ label }: { label: string }) => (
  <button className="flex items-center gap-3 px-6 py-2.5 bg-[#FFF7F4] border border-[#FFD0B9] rounded-full text-[13px] md:text-[14px] font-bold text-gray-800 hover:bg-[#FFF2ED] transition-all group shadow-sm">
    {label}
    <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
  </button>
);

export default function StaysSection() {
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
    <section className="py-24 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        {/* Category Icons */}
        <CategoryFilters />

        {/* Property Filters Row */}
        <div className="flex flex-wrap items-center gap-4 mb-20 md:justify-center">
          <FilterDropdown label="Review Score" />
          <FilterDropdown label="Hotel Star" />
          <FilterDropdown label="Facilities" />
          <FilterDropdown label="Hotel Theme" />
          
          <button className="flex items-center gap-2.5 px-7 py-2.5 bg-[#FFF7F4] border border-[#FFD0B9] rounded-full text-[13px] md:text-[14px] font-bold text-gray-800 hover:bg-[#FFF2ED] transition-all shadow-sm">
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>

        {/* Section Title & Navigation */}
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-[32px] md:text-[45px] font-serif text-gray-900 tracking-tight leading-tight">
            Top Rated Stays in North Goa
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

        {/* Carousel / Grid of Stays */}
        <div 
          ref={scrollRef}
          className="flex gap-6 md:gap-10 overflow-x-auto no-scrollbar pb-10 -mx-4 px-4 md:-mx-0 md:px-0 scroll-smooth"
        >
          {stays.map((stay) => (
            <StayCard key={stay.id} {...stay} />
          ))}
        </div>
      </div>
    </section>
  );
}
