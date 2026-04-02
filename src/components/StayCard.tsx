import Image from "next/image";
import { Star, Heart } from "lucide-react";

interface StayCardProps {
  id: string;
  title: string;
  location: string;
  category: string;
  bedrooms?: number;
  rating?: number;
  image: string;
  trending?: boolean;
}

export default function StayCard({ 
  id, 
  title, 
  location, 
  category, 
  bedrooms, 
  rating = 4.8, 
  image, 
  trending 
}: StayCardProps) {
  return (
    <div className="w-full group cursor-pointer">
      <div className="relative aspect-[3/4] rounded-[24px] overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all duration-500">
        <Image
          src={image || "/images/stays/pool_villa.png"}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-1000"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
        />
        <div className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-xl rounded-full text-white hover:bg-white hover:text-black transition-all shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-500">
          <Heart size={18} className="hover:fill-current" />
        </div>
        {trending && (
          <div className="absolute bottom-4 left-4 px-3 py-1 bg-[#FF5A5F] text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg">
            Trending
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mb-1 px-1">
        <h3 className="text-[15px] font-bold text-gray-900 group-hover:text-black transition-colors truncate pr-2 tracking-tight">{title}</h3>
        <div className="flex items-center gap-1 shrink-0">
          <Star size={13} className="fill-[#FFB400] text-[#FFB400]" />
          <span className="text-[13px] font-bold text-gray-800">{rating.toFixed(1)}</span>
        </div>
      </div>
      
      <p className="text-[12px] text-gray-500 font-medium px-1 mb-4 truncate">
        {bedrooms ? `${bedrooms} BHK ` : ""}{category} • {location}
      </p>
      
      <div className="px-1">
        <button className="px-5 py-2 bg-gray-50 hover:bg-gray-100 text-gray-900 text-[11px] font-bold rounded-full transition-all border border-gray-100 hover:border-gray-200 shadow-sm">
          View Details
        </button>
      </div>
    </div>
  );
}
