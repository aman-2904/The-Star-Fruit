import { Search, MapPin, Calendar, Users, Hotel, Ship, Home } from "lucide-react";

export default function SearchWidget() {
  const tabs = [
    { label: "Villas", icon: <Home size={18} /> },
    { label: "Cruise", icon: <Ship size={18} /> },
    { label: "Stays", icon: <Hotel size={18} /> },
  ];
  const activeTab = "Villas";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 -mt-[380px] md:-mt-80 relative z-10 transition-all">
      <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] md:rounded-[48px] px-4 py-4 md:px-10 md:py-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.25)] border border-white/40">
        {/* Tabs */}
        <div className="flex overflow-x-auto no-scrollbar space-x-6 md:space-x-10 mb-6 md:mb-8 border-b border-gray-100/30 md:ml-4">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              className={`pb-4 md:pb-5 text-[13px] md:text-[15px] font-extrabold transition-all relative flex items-center gap-2 md:gap-2.5 whitespace-nowrap ${activeTab === tab.label
                ? "text-black border-b-[3px] border-black"
                : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Fields Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-3.5 mb-6 md:mb-8">
          <div className="col-span-2 lg:col-span-1 bg-white/80 p-3.5 md:p-4 rounded-full border border-gray-100/50 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
            <div className="flex items-center gap-2 text-gray-400 mb-0.5">
              <MapPin size={16} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] group-hover:text-black transition-colors" />
              <span className="text-[9.5px] md:text-[10.5px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black">Location</span>
            </div>
            <p className="text-[12.5px] md:text-[14.5px] font-bold text-gray-500 ml-6 md:ml-7 line-clamp-1">Where to go?</p>
          </div>

          <div className="col-span-1 bg-white/80 p-3.5 md:p-4 rounded-full border border-gray-100/50 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
            <div className="flex items-center gap-2 text-gray-400 mb-0.5">
              <Calendar size={16} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] group-hover:text-black transition-colors" />
              <span className="text-[9.5px] md:text-[10.5px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black">Check-in</span>
            </div>
            <p className="text-[12.5px] md:text-[14.5px] font-bold text-gray-500 ml-6 md:ml-7">Add date</p>
          </div>

          <div className="col-span-1 bg-white/80 p-3.5 md:p-4 rounded-full border border-gray-100/50 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
            <div className="flex items-center gap-2 text-gray-400 mb-0.5">
              <Calendar size={16} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] group-hover:text-black transition-colors" />
              <span className="text-[9.5px] md:text-[10.5px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black">Check-out</span>
            </div>
            <p className="text-[12.5px] md:text-[14.5px] font-bold text-gray-500 ml-6 md:ml-7">Add date</p>
          </div>

          <div className="col-span-1 bg-white/80 p-3.5 md:p-4 rounded-full border border-gray-100/50 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
            <div className="flex items-center gap-2 text-gray-400 mb-0.5">
              <Users size={16} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] group-hover:text-black transition-colors" />
              <span className="text-[9.5px] md:text-[10.5px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black">Guests</span>
            </div>
            <p className="text-[12.5px] md:text-[14.5px] font-bold text-gray-500 ml-6 md:ml-7">Add guests</p>
          </div>

          <div className="col-span-1 bg-white/80 p-3.5 md:p-4 rounded-full border border-gray-100/50 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
            <div className="flex items-center gap-2 text-gray-400 mb-0.5">
              <Calendar size={16} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] group-hover:text-black transition-colors" />
              <span className="text-[9.5px] md:text-[10.5px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black">Purpose</span>
            </div>
            <p className="text-[12.5px] md:text-[14.5px] font-bold text-gray-500 ml-6 md:ml-7">Why go?</p>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center -mb-12 md:-mb-16 px-4">
          <button className="w-full sm:w-auto bg-[#1C2024] text-white px-8 md:px-20 py-3.5 md:py-4 rounded-[30px] md:rounded-[48px] flex items-center justify-center gap-3 md:gap-4 hover:bg-[#1C2024] transition-all hover:scale-[1.02] active:scale-[0.98] font-black text-sm md:text-base shadow-2xl border-4 border-[#1C2024] uppercase tracking-widest">
            <Search size={20} strokeWidth={3} />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
