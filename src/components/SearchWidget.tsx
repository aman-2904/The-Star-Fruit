"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Calendar, Users, Hotel, Ship, Home } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SearchWidget({ isHero = true }: { isHero?: boolean }) {
  const tabs = [
    { label: "Villas", icon: <Home size={18} /> },
    { label: "Stays", icon: <Hotel size={18} /> },
    { label: "Cruise", icon: <Ship size={18} /> },
  ];
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("Villas");
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  
  // Initialize from URL params
  useEffect(() => {
    const loc = searchParams.get('location');
    const guestCount = searchParams.get('guests');
    const cin = searchParams.get('checkin');
    const cout = searchParams.get('checkout');

    if (loc) setLocation(loc);
    if (guestCount) setGuests(guestCount);
    if (cin) setCheckIn(cin);
    if (cout) setCheckOut(cout);
  }, [searchParams]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (checkIn) params.set('checkin', checkIn);
    if (checkOut) params.set('checkout', checkOut);
    if (guests) params.set('guests', guests);

    // Maintain existing category filters if on /stays
    const existingCats = searchParams.get('cats');
    if (existingCats) params.set('cats', existingCats);

    const queryString = params.toString();
    router.push(`/stays${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 md:px-6 relative z-10 transition-all ${isHero ? '-mt-[380px] md:-mt-80' : 'pt-2'}`}>
      <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] md:rounded-[48px] px-4 py-4 md:px-10 md:py-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.25)] border border-white/40">
        {/* Tabs */}
        <div className="flex justify-center overflow-x-auto no-scrollbar space-x-6 md:space-x-10 mb-6 md:mb-8 border-b border-gray-100/30 w-full">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
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

        {/* Search Fields or Maintenance State */}
        {activeTab === "Cruise" ? (
          <div className="py-12 md:py-16 text-center flex flex-col items-center justify-center fade-in">
            <Ship size={48} strokeWidth={1.5} className="text-gray-300 mb-4" />
            <h3 className="text-xl md:text-2xl font-serif text-gray-900 mb-2 tracking-tight">Cruises are under maintenance</h3>
            <p className="text-gray-500 font-medium text-sm md:text-base max-w-sm">We're actively upgrading our cruise booking experience. Please check back soon!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3.5 mb-6 md:mb-8 animate-in fade-in duration-300">
              {/* Location */}
              <div className="col-span-2 lg:col-span-1 bg-white/80 p-3.5 md:p-4 rounded-full border border-gray-100/50 shadow-sm focus-within:shadow-md focus-within:border-gray-300 transition-all group">
                <div className="flex items-center gap-2 text-gray-400 mb-0.5 ml-2 md:ml-3">
                  <MapPin size={16} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] group-focus-within:text-black transition-colors" />
                  <label htmlFor="location" className="text-[9.5px] md:text-[10.5px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black cursor-pointer">Location</label>
                </div>
                <input 
                  id="location"
                  type="text" 
                  placeholder="Where to go?" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-[12.5px] md:text-[14.5px] font-bold text-gray-900 placeholder:text-gray-400 ml-8 md:ml-[42px] pr-4 outline-none border-none p-0 focus:ring-0" 
                />
              </div>

              {/* Check-in */}
              <div className="col-span-1 bg-white/80 p-3.5 md:p-4 rounded-full border border-gray-100/50 shadow-sm focus-within:shadow-md focus-within:border-gray-300 transition-all group relative">
                <div className="flex items-center gap-2 text-gray-400 mb-0.5 ml-2 md:ml-3">
                  <Calendar size={16} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] group-focus-within:text-black transition-colors" />
                  <label htmlFor="checkin" className="text-[9.5px] md:text-[10.5px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black cursor-pointer">Check-in</label>
                </div>
                <div className="relative ml-8 md:ml-[42px] pr-4">
                  <input 
                    id="checkin"
                    type="date" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className={`w-full bg-transparent text-[12.5px] md:text-[14.5px] font-bold outline-none border-none p-0 focus:ring-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${checkIn ? 'text-gray-900' : 'text-transparent'}`} 
                  />
                  {!checkIn && <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[12.5px] md:text-[14.5px] font-bold text-gray-400 pointer-events-none">Add date</span>}
                </div>
              </div>

              {/* Check-out */}
              <div className="col-span-1 bg-white/80 p-3.5 md:p-4 rounded-full border border-gray-100/50 shadow-sm focus-within:shadow-md focus-within:border-gray-300 transition-all group relative">
                <div className="flex items-center gap-2 text-gray-400 mb-0.5 ml-2 md:ml-3">
                  <Calendar size={16} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] group-focus-within:text-black transition-colors" />
                  <label htmlFor="checkout" className="text-[9.5px] md:text-[10.5px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black cursor-pointer">Check-out</label>
                </div>
                <div className="relative ml-8 md:ml-[42px] pr-4">
                  <input 
                    id="checkout"
                    type="date" 
                    value={checkOut}
                    min={checkIn || undefined}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className={`w-full bg-transparent text-[12.5px] md:text-[14.5px] font-bold outline-none border-none p-0 focus:ring-0 cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer ${checkOut ? 'text-gray-900' : 'text-transparent'}`} 
                  />
                  {!checkOut && <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[12.5px] md:text-[14.5px] font-bold text-gray-400 pointer-events-none">Add date</span>}
                </div>
              </div>

              {/* Guests */}
              <div className="col-span-2 lg:col-span-1 bg-white/80 p-3.5 md:p-4 rounded-full border border-gray-100/50 shadow-sm focus-within:shadow-md focus-within:border-gray-300 transition-all group overflow-hidden relative">
                <div className="flex items-center gap-2 text-gray-400 mb-0.5 ml-2 md:ml-3">
                  <Users size={16} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] group-focus-within:text-black transition-colors" />
                  <label htmlFor="guests" className="text-[9.5px] md:text-[10.5px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black cursor-pointer pointer-events-none">Guests</label>
                </div>
                <select 
                  id="guests"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full appearance-none bg-transparent text-[12.5px] md:text-[14.5px] font-bold text-gray-900 pl-8 md:pl-[42px] pr-8 outline-none border-none p-0 focus:ring-0 cursor-pointer -ml-2 select-none"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6">6+ Guests</option>
                </select>
                <div className="pointer-events-none absolute right-4 md:right-5 top-1/2 -translate-y-1/2 mt-2 md:mt-3 text-gray-400 group-hover:text-black transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 md:w-4 md:h-4"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            {/* Search Button */}
            <div className={`flex justify-center px-4 ${isHero ? '-mb-12 md:-mb-16' : 'mt-4 mb-2'}`}>
              <button 
                onClick={handleSearch}
                className="w-full sm:w-auto bg-[#1C2024] text-white px-8 md:px-20 py-3.5 md:py-4 rounded-[30px] md:rounded-[48px] flex items-center justify-center gap-3 md:gap-4 hover:bg-[#1C2024] transition-all hover:scale-[1.02] active:scale-[0.98] font-black text-sm md:text-base shadow-2xl border-4 border-[#1C2024] uppercase tracking-widest"
              >
                <Search size={20} strokeWidth={3} />
                Search
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
