"use client";

import Image from "next/image";
import { MoveRight } from "lucide-react";

const stayTypes = [
  {
    id: "hotels",
    title: "Hotels",
    description: "Experience full-service comfort with modern rooms, on-site dining, and warm hospitality. Perfect for short trips, business stays, or weekend getaways.",
    image: "/images/stay_hotel.png",
    linkText: "View Hotels",
  },
  {
    id: "resorts",
    title: "Resorts",
    description: "Escape to destinations that combine comfort, dining, and leisure in one place. Great for holidays, celebrations, and peaceful retreats.",
    image: "/images/stay_resort.png",
    linkText: "View Resorts",
  },
  {
    id: "villas",
    title: "Villas",
    description: "Enjoy spacious private homes designed for relaxation and togetherness. Ideal for families or groups who want luxury, privacy, and a personal touch.",
    image: "/images/stay_villa.png",
    linkText: "View Villas",
  },
  {
    id: "cruise",
    title: "Cruise",
    description: "Set sail on an unforgettable journey across the seas. Enjoy world-class dining, magnificent ocean views, and premium entertainment all in one place.",
    image: "/images/stay_cruise.png",
    linkText: "View Cruises",
  },


];

export default function StayTypesSection() {
  return (
    <section className="py-12  bg-white">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10">
        <div className="mb-12">
          <div className="max-w-2xl">
            <h2 className="text-[32px] md:text-[45px] font-serif text-gray-900 tracking-tight leading-tight mb-4">
              Find the stay that fits your journey
            </h2>
            <p className="text-gray-500 text-[15px] md:text-[16px] leading-relaxed max-w-xl">
              From cozy cottages to luxury villas, choose the kind of stay that matches your mood, your style, and your reason to travel.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stayTypes.map((type) => (
            <div
              key={type.id}
              className="bg-[#F8F9FA] rounded-[24px] overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-1 flex flex-col h-full"
            >
              <div className="relative h-[250px] w-full overflow-hidden m-4 rounded-[18px]">
                <Image
                  src={type.image}
                  alt={type.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="px-8 pb-8 flex flex-col flex-1">
                <h3 className="text-[20px] font-bold text-gray-900 mb-3">{type.title}</h3>
                <p className="text-gray-500 text-[13px] leading-relaxed mb-6 flex-1">
                  {type.description}
                </p>
                <div className="flex items-center justify-between group/link">
                  <span className="text-[13px] md:text-[14px] font-bold text-gray-900 group-hover:text-black transition-colors">
                    {type.linkText}
                  </span>
                  <MoveRight size={18} className="text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
