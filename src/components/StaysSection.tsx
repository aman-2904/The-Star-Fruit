"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import StayCard from "./StayCard";
import CategoryFilters from "./CategoryFilters";
import { ChevronLeft, ChevronRight, ChevronDown, SlidersHorizontal, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Property {
  id: string;
  listing_title: string;
  city: string;
  category: string;
  bedrooms?: number;
  images: string[];
  status: string;
  // Mocking rating for now as it's not in DB
  rating?: number;
}

const FilterDropdown = ({ label, options, value, onChange }: { label: string, options: string[], value: string, onChange: (val: string) => void }) => (
  <div className="relative group">
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none flex items-center gap-3 pl-6 pr-10 py-2.5 bg-[#FFF7F4] border border-[#FFD0B9] rounded-full text-[13px] md:text-[14px] font-bold text-gray-800 hover:bg-[#FFF2ED] transition-all shadow-sm outline-none cursor-pointer"
    >
      <option value="">{label}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors">
      <ChevronDown size={16} />
    </div>
  </div>
);

const StayCarousel = ({ title, stays }: { title: string, stays: Property[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (stays.length === 0) return null;

  return (
    <div className="mb-16 last:mb-0">
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-[32px] md:text-[48px] font-serif text-gray-900 tracking-tight leading-tight max-w-2xl">
          {title}
        </h2>
        <div className="hidden md:flex gap-3 mb-2">
          <button
            onClick={() => scroll("left")}
            className="p-4 bg-white hover:bg-gray-50 rounded-full border border-gray-100 transition-all text-gray-400 hover:text-black shadow-sm hover:shadow-md active:scale-95"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-4 bg-white hover:bg-gray-50 rounded-full border border-gray-100 transition-all text-gray-400 hover:text-black shadow-sm hover:shadow-md active:scale-95"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar pb-10 -mx-4 px-4 md:-mx-0 md:px-0 scroll-smooth snap-x snap-mandatory"
      >
        {stays.map((property: Property) => (
          <div key={property.id} className="flex-shrink-0 w-[80vw] sm:w-[280px] lg:w-[calc((100%-96px)/5)] snap-center">
            <StayCard 
              id={property.id}
              title={property.listing_title}
              location={property.city}
              category={property.category}
              bedrooms={property.bedrooms}
              image={property.images?.[0]}
              rating={4.8} // Mocked rating
              trending={parseInt(property.id.slice(-1), 16) > 12} // Deterministic logic
            />
          </div>
        ))}
      </div>
    </div>
  );
};

import Link from "next/link";

interface StaysSectionProps {
  viewMode?: "carousel" | "grid";
  title?: string;
}

export default function StaysSection({ viewMode = "carousel", title }: StaysSectionProps) {
  const [activeCategories, setActiveCategories] = useState<string[]>(["pool"]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    reviewScore: "",
    hotelStar: "",
    facilities: "",
    theme: ""
  });

  useEffect(() => {
    async function fetchProperties() {
      try {
        if (!supabase) return;
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProperties(data || []);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  // For Home page carousel: combine all stays into "Top Rated Stays in Goa"
  // For Listing page: show all stays grouped or in a single grid
  const groupedProperties = properties.reduce((acc: Record<string, Property[]>, prop) => {
    const city = prop.city || "Goa";
    if (!acc[city]) acc[city] = [];
    acc[city].push(prop);
    return acc;
  }, {});

  return (
    <section className={`pb-24 bg-white overflow-hidden ${viewMode === 'carousel' ? 'pt-20 md:pt-32' : 'pt-10'}`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">
        {/* Category Icons */}
        <CategoryFilters 
          activeCategories={activeCategories} 
          onCategoryChange={(id) => {
            setActiveCategories(prev => 
              prev.includes(id) 
                ? prev.filter(c => c !== id) 
                : [...prev, id]
            );
          }} 
        />

        {/* Property Filters Row */}
        <div className="flex flex-wrap items-center gap-4 mb-16 md:justify-center">
          <FilterDropdown 
            label="Review Score" 
            options={["9+ Superb", "8+ Very Good", "7+ Good"]} 
            value={filters.reviewScore}
            onChange={(val) => setFilters({...filters, reviewScore: val})}
          />
          <FilterDropdown 
            label="Hotel Star" 
            options={["5 Stars", "4 Stars", "3 Stars"]} 
            value={filters.hotelStar}
            onChange={(val) => setFilters({...filters, hotelStar: val})}
          />
          <FilterDropdown 
            label="Facilities" 
            options={["Pool", "Spa", "Gym", "Restaurant"]} 
            value={filters.facilities}
            onChange={(val) => setFilters({...filters, facilities: val})}
          />
          <FilterDropdown 
            label="Hotel Theme" 
            options={["Luxury", "Boutique", "Resort", "Business"]} 
            value={filters.theme}
            onChange={(val) => setFilters({...filters, theme: val})}
          />

          <button className="flex items-center gap-2.5 px-8 py-3 bg-[#FFF7F4] border border-[#FFD0B9] rounded-full text-[14px] font-bold text-gray-800 hover:bg-[#FFF2ED] transition-all shadow-sm">
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={40} className="animate-spin text-[#EC5B13] mb-4" />
            <p className="text-gray-500 font-medium">Discovering best stays for you...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
            <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-serif text-gray-900 mb-2">No properties published yet</h3>
            <p className="text-gray-500">Check back soon for curated luxury stays.</p>
          </div>
        ) : viewMode === "carousel" ? (
          <div>
            <StayCarousel 
              title={title || "Top Rated Stays in Goa"} 
              stays={properties} 
            />
            <div className="flex justify-center mt-8">
              <Link 
                href="/stays" 
                className="px-12 py-4 bg-black text-white text-[13px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-gray-900 transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                View More Stays
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {properties.map((property: Property) => (
              <StayCard 
                key={property.id} 
                id={property.id}
                title={property.listing_title}
                location={property.city}
                category={property.category}
                bedrooms={property.bedrooms}
                image={property.images?.[0]}
                rating={4.8}
                trending={parseInt(property.id.slice(-1), 16) > 12}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
