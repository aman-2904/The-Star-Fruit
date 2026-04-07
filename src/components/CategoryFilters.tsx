import { Umbrella, Laptop, PartyPopper, Trees, Castle, Waves, PawPrint, SlidersHorizontal } from "lucide-react";

const categories = [
  { id: 'pool', label: "POOL VILLAS", icon: <Waves size={22} strokeWidth={2.5} /> },
  { id: 'beach', label: "BEACHFRONT", icon: <Umbrella size={22} strokeWidth={2.5} /> },
  { id: 'pet', label: "PET-FRIENDLY", icon: <PawPrint size={22} strokeWidth={2.5} /> },
  { id: 'heritage', label: "HERITAGE", icon: <Castle size={22} strokeWidth={2.5} /> },
  { id: 'work', label: "WORKATION", icon: <Laptop size={22} strokeWidth={2.5} /> },
  { id: 'party', label: "PARTIES", icon: <PartyPopper size={22} strokeWidth={2.5} /> },
  { id: 'nature', label: "NATURE RETREAT", icon: <Trees size={22} strokeWidth={2.5} /> },
];

interface CategoryFiltersProps {
  activeCategories: string[];
  onCategoryChange: (id: string) => void;
  onFiltersClick: () => void;
  activeFiltersCount: number;
}

export default function CategoryFilters({ activeCategories, onCategoryChange, onFiltersClick, activeFiltersCount }: CategoryFiltersProps) {

  return (
    <div className="flex items-center gap-6 mb-10 w-full overflow-hidden border-b border-gray-100 pb-1">
      {/* Fixed Filters Button on left */}
      <div className="flex-shrink-0 flex items-center h-full pr-4 md:pr-6 border-r border-gray-200 py-2">
        <button 
          onClick={onFiltersClick}
          className="relative flex items-center gap-2.5 px-6 py-3 bg-[#FFF7F4] border border-[#FFD0B9] rounded-[14px] text-[13px] md:text-[14px] font-bold text-gray-800 hover:bg-[#FFF2ED] transition-all shadow-sm"
        >
          <SlidersHorizontal size={16} strokeWidth={2.5} />
          Filters
          
          {activeFiltersCount > 0 && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-in fade-in zoom-in duration-300">
              {activeFiltersCount}
            </div>
          )}
        </button>
      </div>

      {/* Scrollable Categories */}
      <div className="flex items-center justify-start gap-8 md:gap-14 overflow-x-auto no-scrollbar pt-2 flex-grow">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex flex-col items-center gap-4 pb-4 relative transition-all whitespace-nowrap group focus:outline-none ${
              activeCategories.includes(cat.id) ? "text-black" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <div className={`transition-all duration-300 ${
              activeCategories.includes(cat.id) ? "text-[#FF5A5F]" : "text-gray-400 opacity-60 group-hover:opacity-100"
            }`}>
              {cat.icon}
            </div>
            <span className={`text-[11px] md:text-[12px] font-extrabold tracking-[0.1em] uppercase ${
              activeCategories.includes(cat.id) ? "opacity-100" : "opacity-70 group-hover:opacity-100"
            }`}>
              {cat.label}
            </span>
            {activeCategories.includes(cat.id) && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FF5A5F] rounded-t-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
