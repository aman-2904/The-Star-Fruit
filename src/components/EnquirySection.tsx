"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

export default function EnquirySection() {
  return (
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
}
