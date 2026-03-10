import { Search, MapPin, Calendar, Users, Hotel, Ship, Home, Building } from "lucide-react";

export default function SearchWidget() {
  const tabs = [
    { label: "Hotels", icon: <Hotel size={18} /> },
    { label: "Cruise", icon: <Ship size={18} /> },
    { label: "Villas", icon: <Home size={18} /> },
    { label: "Hostels", icon: <Building size={18} /> },
  ];
  const activeTab = "Hotels";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 -mt-64 md:-mt-96 relative z-10 transition-all">
      <div className="bg-white/95 backdrop-blur-xl rounded-[32px] md:rounded-[48px] p-6 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white/40">
        {/* Tabs */}
        <div className="flex overflow-x-auto no-scrollbar space-x-6 md:space-x-10 mb-8 md:mb-10 border-b border-gray-100/50 md:ml-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-3.5 mb-8 md:mb-10">
          <div className="bg-white p-4 md:p-5 rounded-[24px] md:rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
            <div className="flex items-center gap-3 text-gray-400 mb-1">
              <MapPin size={20} className="w-[18px] h-[18px] md:w-5 md:h-5 group-hover:text-black transition-colors" />
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black">Location</span>
            </div>
            <p className="text-[14px] md:text-[15px] font-bold text-gray-500 ml-7 md:ml-8">Where to go?</p>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-[24px] md:rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
            <div className="flex items-center gap-3 text-gray-400 mb-1">
              <Calendar size={20} className="w-[18px] h-[18px] md:w-5 md:h-5 group-hover:text-black transition-colors" />
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black">Check-in</span>
            </div>
            <p className="text-[14px] md:text-[15px] font-bold text-gray-500 ml-7 md:ml-8">Add date</p>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-[24px] md:rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
            <div className="flex items-center gap-3 text-gray-400 mb-1">
              <Calendar size={20} className="w-[18px] h-[18px] md:w-5 md:h-5 group-hover:text-black transition-colors" />
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black">Check-out</span>
            </div>
            <p className="text-[14px] md:text-[15px] font-bold text-gray-500 ml-7 md:ml-8">Add date</p>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-[24px] md:rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
            <div className="flex items-center gap-3 text-gray-400 mb-1">
              <Users size={20} className="w-[18px] h-[18px] md:w-5 md:h-5 group-hover:text-black transition-colors" />
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black">Guests</span>
            </div>
            <p className="text-[14px] md:text-[15px] font-bold text-gray-500 ml-7 md:ml-8">Add guests</p>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-[24px] md:rounded-[28px] border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group">
            <div className="flex items-center gap-3 text-gray-400 mb-1">
              <Calendar size={20} className="w-[18px] h-[18px] md:w-5 md:h-5 group-hover:text-black transition-colors" />
              <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black">Purpose</span>
            </div>
            <p className="text-[14px] md:text-[15px] font-bold text-gray-500 ml-7 md:ml-8">Why go?</p>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center -mb-16 md:-mb-20 px-4">
          <button className="w-full sm:w-auto bg-[#1a1a1a] text-white px-8 md:px-16 py-4 md:py-6 rounded-[24px] md:rounded-[32px] flex items-center justify-center gap-3 md:gap-4 hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] font-black text-base md:text-lg shadow-2xl border-4 border-white/20 uppercase tracking-widest">
            <Search size={22} strokeWidth={3} />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
