"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, Users, Hotel, Ship, Home } from "lucide-react";

export default function SearchWidget() {
  const tabs = [
    { label: "Villas", icon: <Home size={18} /> },
    { label: "Cruise", icon: <Ship size={18} /> },
    { label: "Stays", icon: <Hotel size={18} /> },
  ];
  const [activeTab, setActiveTab] = useState("Villas");
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [purpose, setPurpose] = useState("");
  
  const handleSearch = () => {
    console.log({ activeTab, location, checkIn, checkOut, guests, purpose });
    // Implement actual search routing/logic here
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 -mt-[380px] md:-mt-80 relative z-10 transition-all">
      <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] md:rounded-[48px] px-4 py-4 md:px-10 md:py-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.25)] border border-white/40">
        {/* Tabs */}
        <div className="flex justify-start md:justify-center overflow-x-auto no-scrollbar space-x-6 md:space-x-10 mb-6 md:mb-8 border-b border-gray-100/30">
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

        {/* Search Fields Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 md:gap-3.5 mb-6 md:mb-8">
          {/* Location */}
          <div className="col-span-2 lg:col-span-1 bg-white/80 p-3.5 md:p-4 rounded-[24px] border border-gray-100/50 shadow-sm focus-within:shadow-md focus-within:border-gray-300 transition-all group">
            <div className="flex items-center gap-2 text-gray-400 mb-0.5">
              <MapPin size={16} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] group-focus-within:text-black transition-colors" />
              <label htmlFor="location" className="text-[9.5px] md:text-[10.5px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black cursor-pointer">Location</label>
            </div>
            <input 
              id="location"
              type="text" 
              placeholder="Where to go?" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-[12.5px] md:text-[14.5px] font-bold text-gray-900 placeholder:text-gray-400 ml-6 md:ml-7 outline-none border-none p-0 focus:ring-0" 
            />
          </div>

          {/* Check-in */}
          <div className="col-span-1 bg-white/80 p-3.5 md:p-4 rounded-[24px] border border-gray-100/50 shadow-sm focus-within:shadow-md focus-within:border-gray-300 transition-all group relative">
            <div className="flex items-center gap-2 text-gray-400 mb-0.5">
              <Calendar size={16} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] group-focus-within:text-black transition-colors" />
              <label htmlFor="checkin" className="text-[9.5px] md:text-[10.5px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black cursor-pointer">Check-in</label>
            </div>
            <div className="relative ml-6 md:ml-7">
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
          <div className="col-span-1 bg-white/80 p-3.5 md:p-4 rounded-[24px] border border-gray-100/50 shadow-sm focus-within:shadow-md focus-within:border-gray-300 transition-all group relative">
            <div className="flex items-center gap-2 text-gray-400 mb-0.5">
              <Calendar size={16} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] group-focus-within:text-black transition-colors" />
              <label htmlFor="checkout" className="text-[9.5px] md:text-[10.5px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black cursor-pointer">Check-out</label>
            </div>
            <div className="relative ml-6 md:ml-7">
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
          <div className="col-span-1 bg-white/80 p-3.5 md:p-4 rounded-[24px] border border-gray-100/50 shadow-sm focus-within:shadow-md focus-within:border-gray-300 transition-all group">
            <div className="flex items-center gap-2 text-gray-400 mb-0.5">
              <Users size={16} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] group-focus-within:text-black transition-colors" />
              <label htmlFor="guests" className="text-[9.5px] md:text-[10.5px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black cursor-pointer">Guests</label>
            </div>
            <select 
              id="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-transparent text-[12.5px] md:text-[14.5px] font-bold text-gray-900 ml-5 md:ml-6 outline-none border-none p-0 focus:ring-0 cursor-pointer"
            >
              <option value="1">1 Guest</option>
              <option value="2">2 Guests</option>
              <option value="3">3 Guests</option>
              <option value="4">4 Guests</option>
              <option value="5">5 Guests</option>
              <option value="6">6+ Guests</option>
            </select>
          </div>

          {/* Purpose */}
          <div className="col-span-1 bg-white/80 p-3.5 md:p-4 rounded-[24px] border border-gray-100/50 shadow-sm focus-within:shadow-md focus-within:border-gray-300 transition-all group">
            <div className="flex items-center gap-2 text-gray-400 mb-0.5">
              <Calendar size={16} className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] group-focus-within:text-black transition-colors" />
              <label htmlFor="purpose" className="text-[9.5px] md:text-[10.5px] font-black uppercase tracking-[0.12em] md:tracking-[0.15em] text-black cursor-pointer">Purpose</label>
            </div>
            <select 
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className={`w-full bg-transparent text-[12.5px] md:text-[14.5px] font-bold ml-5 md:ml-6 outline-none border-none p-0 focus:ring-0 cursor-pointer ${purpose ? 'text-gray-900' : 'text-gray-400'}`}
            >
              <option value="" disabled hidden>Why go?</option>
              <option value="leisure" className="text-gray-900">Leisure</option>
              <option value="business" className="text-gray-900">Business</option>
              <option value="family" className="text-gray-900">Family Trip</option>
              <option value="couples" className="text-gray-900">Couples Retreat</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center -mb-12 md:-mb-16 px-4">
          <button 
            onClick={handleSearch}
            className="w-full sm:w-auto bg-[#1C2024] text-white px-8 md:px-20 py-3.5 md:py-4 rounded-[30px] md:rounded-[48px] flex items-center justify-center gap-3 md:gap-4 hover:bg-[#1C2024] transition-all hover:scale-[1.02] active:scale-[0.98] font-black text-sm md:text-base shadow-2xl border-4 border-[#1C2024] uppercase tracking-widest"
          >
            <Search size={20} strokeWidth={3} />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
