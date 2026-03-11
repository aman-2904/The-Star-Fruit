"use client";

import { useState, useEffect } from "react";
import { Star, ChevronDown } from "lucide-react";

interface Testimonial {
  id: number;
  text: string;
  author: string;
  location: string;
  bgColor: string;
  textColor: string;
  starColor: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "Booked a weekend stay within minutes. Smooth experience and great suggestions based on my location. Really loved how easy the interface felt.",
    author: "Ananya M.",
    location: "From Hyderabad",
    bgColor: "bg-[#D1D1D1]",
    textColor: "text-gray-800",
    starColor: "text-black",
  },
  {
    id: 2,
    text: "Was traveling for work and needed a clean, trusted place quickly. The verified listings and clear cancellation policy gave me total peace of mind.",
    author: "Karan M.",
    location: "From Bengaluru",
    bgColor: "bg-[#8E93FF]",
    textColor: "text-white",
    starColor: "text-white",
  },
  {
    id: 3,
    text: "Took my family for a short break and found a beautiful cottage instantly. Safe, clean, and super convenient booking. Highly recommend!",
    author: "Jaanu K.",
    location: "From Mumbai",
    bgColor: "bg-[#F4F5F7]",
    textColor: "text-gray-800",
    starColor: "text-black",
  },
  {
    id: 4,
    text: "Tried a glamping site for the first time and it was amazing. Nature vibe with hotel-like comfort. Booking experience was very smooth.",
    author: "Vikram S.",
    location: "From Pune",
    bgColor: "bg-[#CCD96B]",
    textColor: "text-gray-800",
    starColor: "text-black",
  },
  {
    id: 5,
    text: "Booked a weekend stay within minutes. Smooth experience and great suggestions based on my location. Really loved how easy the interface felt.",
    author: "Ananya M.",
    location: "From Hyderabad",
    bgColor: "bg-[#CCD96B]",
    textColor: "text-gray-800",
    starColor: "text-black",
  },
  {
    id: 6,
    text: "Was traveling for work and needed a clean, trusted place quickly. The verified listings and clear cancellation policy gave me total peace of mind.",
    author: "Karan M.",
    location: "From Bengaluru",
    bgColor: "bg-[#0F1113]",
    textColor: "text-white",
    starColor: "text-white",
  },
  {
    id: 7,
    text: "Took my family for a short break and found a beautiful cottage instantly. Safe, clean, and super convenient booking. Highly recommend!",
    author: "Jaanu K.",
    location: "From Mumbai",
    bgColor: "bg-[#8E93FF]",
    textColor: "text-white",
    starColor: "text-white",
  },
  {
    id: 8,
    text: "Tried a glamping site for the first time and it was amazing. Nature vibe with hotel-like comfort. Booking experience was very smooth.",
    author: "Vikram S.",
    location: "From Pune",
    bgColor: "bg-[#D1D1D1]",
    textColor: "text-gray-800",
    starColor: "text-black",
  },
];

export default function TravelerStories() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const visibleTestimonials = isMobile && !isExpanded 
    ? testimonials.slice(0, 4) 
    : testimonials;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-8 md:px-20">
        <h2 className="text-center text-3xl md:text-4xl font-black mb-16 tracking-tight uppercase">
          TRAVELER STORIES
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {visibleTestimonials.map((item) => (
            <div
              key={item.id}
              className={`${item.bgColor} ${item.textColor} p-6 md:p-8 rounded-[20px] md:rounded-[24px] flex flex-col min-h-[280px] md:min-h-[340px] transition-all hover:scale-[1.02] duration-300 animate-in fade-in slide-in-from-bottom-4`}
            >
              <div className="flex gap-0.5 mb-4 md:mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill="currentColor"
                    className={item.starColor}
                  />
                ))}
              </div>

              <p className="text-[13px] md:text-[15px] leading-relaxed font-medium mb-6 flex-1 opacity-90 line-clamp-4 md:line-clamp-none">
                "{item.text}"
              </p>

              <div className="pt-4 border-t border-current/10">
                <p className="font-bold text-[15px] md:text-[17px] mb-0.5">{item.author}</p>
                <p className="text-[11px] md:text-[12px] font-medium opacity-70">{item.location}</p>
              </div>
            </div>
          ))}
        </div>

        {isMobile && !isExpanded && testimonials.length > 4 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setIsExpanded(true)}
              className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-bold text-sm tracking-wide hover:bg-gray-900 transition-all active:scale-95 shadow-xl"
            >
              Read More
              <ChevronDown size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
