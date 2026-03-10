import Image from "next/image";
import { Star, Heart } from "lucide-react";

interface StayCardProps {
  image: string;
  title: string;
  location: string;
  description: string;
  rating: number;
  trending?: boolean;
}

export default function StayCard({ image, title, location, description, rating, trending }: StayCardProps) {
  return (
    <div className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[calc((100%-96px)/5)] group cursor-pointer snap-start">
      <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden mb-5 shadow-sm group-hover:shadow-2xl transition-all duration-500">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-5 right-5 p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
          <Heart size={20} />
        </div>
        {trending && (
          <div className="absolute bottom-5 left-5 px-3 py-1.5 bg-[#FF5A5F] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg">
            Trending
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-start mb-1.5 px-1">
        <h3 className="text-[17px] md:text-[18px] font-bold text-gray-900 group-hover:text-black transition-colors">{title}</h3>
        <div className="flex items-center gap-1.5">
          <Star size={14} className="fill-[#FFB400] text-[#FFB400]" />
          <span className="text-sm font-bold text-gray-800">{rating.toFixed(1)}</span>
        </div>
      </div>
      
      <p className="text-[13px] md:text-[14px] text-gray-500 font-medium px-1 mb-5">
        {description} • {location}
      </p>
      
      <div className="px-1">
        <button className="px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-900 text-[12px] font-bold rounded-full transition-all border border-gray-100 hover:border-gray-200 shadow-sm">
          View Details
        </button>
      </div>
    </div>
  );
}
