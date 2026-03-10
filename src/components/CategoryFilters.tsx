import { Umbrella, Laptop, PartyPopper, Trees, Castle, Waves, PawPrint } from "lucide-react";

const categories = [
  { id: 'pool', label: "POOL VILLAS", icon: <Waves size={22} strokeWidth={2.5} /> },
  { id: 'beach', label: "BEACHFRONT", icon: <Umbrella size={22} strokeWidth={2.5} /> },
  { id: 'pet', label: "PET-FRIENDLY", icon: <PawPrint size={22} strokeWidth={2.5} /> },
  { id: 'heritage', label: "HERITAGE", icon: <Castle size={22} strokeWidth={2.5} /> },
  { id: 'work', label: "WORKATION", icon: <Laptop size={22} strokeWidth={2.5} /> },
  { id: 'party', label: "PARTIES", icon: <PartyPopper size={22} strokeWidth={2.5} /> },
  { id: 'nature', label: "NATURE RETREAT", icon: <Trees size={22} strokeWidth={2.5} /> },
];

export default function CategoryFilters() {
  const activeCategory = 'pool';

  return (
    <div className="flex items-center gap-8 md:gap-14 overflow-x-auto no-scrollbar pb-1 border-b border-gray-100 mb-10 w-full justify-center md:justify-center">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`flex flex-col items-center gap-4 pb-5 relative transition-all whitespace-nowrap group ${
            activeCategory === cat.id ? "text-black" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <div className={`transition-all duration-300 ${
            activeCategory === cat.id ? "text-[#FF5A5F]" : "text-gray-400 opacity-60 group-hover:opacity-100"
          }`}>
            {cat.icon}
          </div>
          <span className={`text-[11px] md:text-[12px] font-extrabold tracking-[0.1em] uppercase ${
            activeCategory === cat.id ? "opacity-100" : "opacity-70 group-hover:opacity-100"
          }`}>
            {cat.label}
          </span>
          {activeCategory === cat.id && (
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#FF5A5F] rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
