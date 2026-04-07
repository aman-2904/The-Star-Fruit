"use client";

import { useState, useEffect } from "react";
import { 
  X, Home, Building2, Hotel, Wifi, ChefHat, Waves, Umbrella, Award, Diamond,
  Wind, Tv2, Monitor, WashingMachine, Zap, UserCheck, Bath, Dumbbell, Flame,
  Music, Gamepad2, CupSoda, Thermometer, Shirt, Lock, Shield, ShowerHead,
  UtensilsCrossed, Refrigerator, Microwave, Coffee, Layout, Wine, Baby,
  Ghost, Book, Car, Trees, HeartPulse, BellElectric, Briefcase, CalendarDays
} from "lucide-react";

export interface AdvancedFilters {
  propertyType: string;
  amenities: string[];
  bookingOptions: {
    selfCheckIn: boolean;
    allowsPets: boolean;
  };
  standoutStays: string;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters: AdvancedFilters;
  draftFilters: AdvancedFilters;
  onDraftFiltersChange: React.Dispatch<React.SetStateAction<AdvancedFilters>>;
  onApply: (filters: AdvancedFilters) => void;
  resultCount: number;
}

const allAmenities = [
  // Essentials
  { id: 'wifi', label: 'WiFi', icon: <Wifi size={20} className="text-gray-400" /> },
  { id: 'ac', label: 'AC', icon: <Wind size={20} className="text-gray-400" /> },
  { id: 'tv', label: 'TV/Netflix', icon: <Tv2 size={20} className="text-gray-400" /> },
  { id: 'workspace', label: 'Workspace', icon: <Monitor size={20} className="text-gray-400" /> },
  { id: 'washer', label: 'Washer', icon: <WashingMachine size={20} className="text-gray-400" /> },
  { id: 'dryer', label: 'Dryer', icon: <Wind size={20} className="text-gray-400" /> },
  { id: 'ethernet', label: 'Ethernet', icon: <Zap size={20} className="text-gray-400" /> },
  { id: 'housekeeping', label: 'Housekeeping', icon: <UserCheck size={20} className="text-gray-400" /> },
  // Luxury Experience
  { id: 'private_pool', label: 'Private Pool', icon: <Waves size={20} className="text-gray-400" /> },
  { id: 'hot_tub', label: 'Hot Tub/Jacuzzi', icon: <Bath size={20} className="text-gray-400" /> },
  { id: 'beachfront', label: 'Beachfront', icon: <Umbrella size={20} className="text-gray-400" /> },
  { id: 'private_chef', label: 'Private Chef', icon: <ChefHat size={20} className="text-gray-400" /> },
  { id: 'private_gym', label: 'Private Gym', icon: <Dumbbell size={20} className="text-gray-400" /> },
  { id: 'bbq_grill', label: 'BBQ Grill', icon: <Flame size={20} className="text-gray-400" /> },
  { id: 'sound_system', label: 'Sound System', icon: <Music size={20} className="text-gray-400" /> },
  { id: 'game_console', label: 'Game Console', icon: <Gamepad2 size={20} className="text-gray-400" /> },
  { id: 'barbecue', label: 'Fire Pit', icon: <Flame size={20} className="text-gray-400" /> },
  // Bathroom & Bedroom
  { id: 'hair_dryer', label: 'Hair Dryer', icon: <Wind size={20} className="text-gray-400" /> },
  { id: 'shampoo', label: 'Toiletries', icon: <CupSoda size={20} className="text-gray-400" /> },
  { id: 'hot_water', label: 'Hot Water', icon: <Thermometer size={20} className="text-gray-400" /> },
  { id: 'hangers', label: 'Hangers', icon: <Shirt size={20} className="text-gray-400" /> },
  { id: 'iron', label: 'Iron', icon: <Shirt size={20} className="text-gray-400" /> },
  { id: 'safe', label: 'Room Safe', icon: <Lock size={20} className="text-gray-400" /> },
  { id: 'bed_linens', label: 'Bed Linens', icon: <Home size={20} className="text-gray-400" /> },
  { id: 'mosquito_net', label: 'Mosquito Net', icon: <Shield size={20} className="text-gray-400" /> },
  { id: 'shower_head', label: 'Shower head', icon: <ShowerHead size={20} className="text-gray-400" /> },
  { id: 'towels', label: 'Towels', icon: <Home size={20} className="text-gray-400" /> },
  // Kitchen & Dining
  { id: 'kitchen', label: 'Full Kitchen', icon: <UtensilsCrossed size={20} className="text-gray-400" /> },
  { id: 'refrigerator', label: 'Fridge', icon: <Refrigerator size={20} className="text-gray-400" /> },
  { id: 'microwave', label: 'Microwave', icon: <Microwave size={20} className="text-gray-400" /> },
  { id: 'coffee_maker', label: 'Coffee Maker', icon: <Coffee size={20} className="text-gray-400" /> },
  { id: 'kettle', label: 'Electric Kettle', icon: <Coffee size={20} className="text-gray-400" /> },
  { id: 'cooking_basics', label: 'Cooking Basics', icon: <UtensilsCrossed size={20} className="text-gray-400" /> },
  { id: 'dishwasher', label: 'Dishwasher', icon: <WashingMachine size={20} className="text-gray-400" /> },
  { id: 'stove', label: 'Stove/Cooktop', icon: <Layout size={20} className="text-gray-400" /> },
  { id: 'wine_glasses', label: 'Wine Glasses', icon: <Wine size={20} className="text-gray-400" /> },
  { id: 'dining_table', label: 'Dining Table', icon: <Layout size={20} className="text-gray-400" /> },
  // Family & Fun
  { id: 'crib', label: 'Crib/Cot', icon: <Baby size={20} className="text-gray-400" /> },
  { id: 'high_chair', label: 'High Chair', icon: <Baby size={20} className="text-gray-400" /> },
  { id: 'board_games', label: 'Board Games', icon: <Ghost size={20} className="text-gray-400" /> },
  { id: 'books', label: 'Books', icon: <Book size={20} className="text-gray-400" /> },
  { id: 'pool_table', label: 'Pool Table', icon: <Monitor size={20} className="text-gray-400" /> },
  // Parking & Facilities
  { id: 'free_parking', label: 'Free Parking', icon: <Car size={20} className="text-gray-400" /> },
  { id: 'ev_charger', label: 'EV Charger', icon: <Zap size={20} className="text-gray-400" /> },
  { id: 'gym', label: 'Gym access', icon: <Dumbbell size={20} className="text-gray-400" /> },
  { id: 'garden', label: 'Garden/Lawn', icon: <Trees size={20} className="text-gray-400" /> },
  { id: 'elevator', label: 'Elevator', icon: <Home size={20} className="text-gray-400" /> },
  { id: 'single_level', label: 'Single Level', icon: <Home size={20} className="text-gray-400" /> },
  // Outdoor & Views
  { id: 'patio', label: 'Patio/Balcony', icon: <Layout size={20} className="text-gray-400" /> },
  { id: 'backyard', label: 'Backyard', icon: <Trees size={20} className="text-gray-400" /> },
  { id: 'entrance', label: 'Private Entry', icon: <Home size={20} className="text-gray-400" /> },
  { id: 'outdoor_dining', label: 'Outdoor Dining', icon: <UtensilsCrossed size={20} className="text-gray-400" /> },
  { id: 'hammock', label: 'Hammock', icon: <Umbrella size={20} className="text-gray-400" /> },
  // Safety & Services
  { id: 'first_aid', label: 'First Aid Kit', icon: <HeartPulse size={20} className="text-gray-400" /> },
  { id: 'extinguisher', label: 'Extinguisher', icon: <Flame size={20} className="text-gray-400" /> },
  { id: 'smoke_alarm', label: 'Smoke Alarm', icon: <BellElectric size={20} className="text-gray-400" /> },
  { id: 'carbon_alarm', label: 'CO Alarm', icon: <BellElectric size={20} className="text-gray-400" /> },
  { id: 'security_cam', label: 'CCTV/Security', icon: <Shield size={20} className="text-gray-400" /> },
  { id: 'luggage_drop', label: 'Luggage Drop', icon: <Briefcase size={20} className="text-gray-400" /> },
  { id: 'long_term', label: 'Long-term Stay', icon: <CalendarDays size={20} className="text-gray-400" /> },
];

export default function FilterModal({ isOpen, onClose, initialFilters, draftFilters, onDraftFiltersChange, onApply, resultCount }: FilterModalProps) {
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  // Sync state if modal is opened
  useEffect(() => {
    if (isOpen) {
      onDraftFiltersChange(initialFilters);
      setShowAllAmenities(false);
    }
  }, [initialFilters, isOpen, onDraftFiltersChange]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleAmenity = (amenity: string) => {
    onDraftFiltersChange((prev) => {
      const isSelected = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: isSelected
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleClearAll = () => {
    const cleared: AdvancedFilters = {
      propertyType: "",
      amenities: [],
      bookingOptions: { selfCheckIn: false, allowsPets: false },
      standoutStays: "",
    };
    onDraftFiltersChange(cleared);
    // Don't apply immediately; let them click "Show X results"
  };

  const togglePropertyType = (val: string) => {
    onDraftFiltersChange(p => ({ ...p, propertyType: p.propertyType === val ? "" : val }));
  };

  const toggleStandout = (val: string) => {
    onDraftFiltersChange(p => ({ ...p, standoutStays: p.standoutStays === val ? "" : val }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl h-full md:h-[90vh] md:rounded-[24px] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 md:max-h-[900px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-800"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
          <h2 className="text-base font-bold text-gray-900 absolute left-1/2 -translate-x-1/2">
            Filters
          </h2>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:px-10 pb-10 space-y-12">
          
          {/* Property Type */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-5">Property Type</h3>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                { id: "Villa", icon: <Home size={24} strokeWidth={1.5} /> },
                { id: "Hotel", icon: <Hotel size={24} strokeWidth={1.5} /> }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => togglePropertyType(type.id)}
                  className={`flex flex-col gap-8 p-4 rounded-xl border-2 text-left transition-all ${
                    draftFilters.propertyType === type.id
                      ? "border-[#EC5B13] bg-[#FFF7F4] text-gray-900"
                      : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className={draftFilters.propertyType === type.id ? "text-[#EC5B13]" : "text-gray-600"}>
                    {type.icon}
                  </div>
                  <span className="font-semibold text-sm">{type.id}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Amenities */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-5">Amenities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-6">
              {(showAllAmenities ? allAmenities : allAmenities.slice(0, 6)).map((amenity) => (
                <label key={amenity.id} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    {amenity.icon}
                    <span className="text-gray-700 text-[15px]">{amenity.label}</span>
                  </div>
                  <div className={`w-6 h-6 rounded flex items-center justify-center transition-all flex-shrink-0 ${
                    draftFilters.amenities.includes(amenity.id)
                      ? "bg-[#EC5B13] border-[#EC5B13]"
                      : "border border-gray-300 bg-white group-hover:border-gray-400"
                  }`}>
                    {draftFilters.amenities.includes(amenity.id) && (
                      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 5.5L4.5 8.5L12.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={draftFilters.amenities.includes(amenity.id)}
                    onChange={() => toggleAmenity(amenity.id)}
                  />
                </label>
              ))}
            </div>
            {allAmenities.length > 6 && (
              <button 
                onClick={() => setShowAllAmenities(!showAllAmenities)}
                className="px-5 py-2.5 bg-[#FFF7F4] border border-[#FFD0B9] text-gray-800 text-[13px] font-bold rounded-lg hover:bg-[#FFF2ED] transition-colors"
              >
                {showAllAmenities ? "Show Less Amenities" : "Show More Amenities"}
              </button>
            )}
          </section>



          <hr className="border-gray-100" />

          {/* Booking Options */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-5">Booking options</h3>
            <div className="space-y-6">
              
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 text-[15px]">Self check-in</h4>
                  <p className="text-[13px] text-gray-500">Easy access to the property upon arrival</p>
                </div>
                <div className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${draftFilters.bookingOptions.selfCheckIn ? 'bg-[#EC5B13]' : 'bg-gray-200'}`}>
                  <div className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${draftFilters.bookingOptions.selfCheckIn ? 'translate-x-5' : 'translate-x-0'}`} />
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={draftFilters.bookingOptions.selfCheckIn}
                    onChange={(e) => onDraftFiltersChange(p => ({ ...p, bookingOptions: { ...p.bookingOptions, selfCheckIn: e.target.checked } }))}
                  />
                </div>
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 text-[15px]">Allows pets</h4>
                  <p className="text-[13px] text-gray-500">Bringing a service animal?</p>
                </div>
                <div className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${draftFilters.bookingOptions.allowsPets ? 'bg-[#EC5B13]' : 'bg-gray-200'}`}>
                  <div className={`absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${draftFilters.bookingOptions.allowsPets ? 'translate-x-5' : 'translate-x-0'}`} />
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={draftFilters.bookingOptions.allowsPets}
                    onChange={(e) => onDraftFiltersChange(p => ({ ...p, bookingOptions: { ...p.bookingOptions, allowsPets: e.target.checked } }))}
                  />
                </div>
              </label>

            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Standout stays */}
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-5">Standout stays</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { 
                  id: "Guest favourite", 
                  icon: <Award size={24} className="text-gray-700" />,
                  desc: "The most loved homes on the starfruit" 
                },
                { 
                  id: "Luxe", 
                  icon: <Diamond size={24} className="text-gray-700" />,
                  desc: "Extraordinary homes with high-end design" 
                }
              ].map(standout => (
                <button
                  key={standout.id}
                  onClick={() => toggleStandout(standout.id)}
                  className={`flex flex-col gap-6 p-4 rounded-xl border transition-all text-left ${
                    draftFilters.standoutStays === standout.id
                      ? "border-[#EC5B13] bg-[#FFF7F4]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div>{standout.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{standout.id}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{standout.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 md:px-6 md:py-4 bg-white border-t border-gray-100 flex items-center justify-between z-10 shrink-0">
          <button 
            onClick={handleClearAll}
            className="text-[15px] font-semibold text-gray-800 underline decoration-gray-400 hover:text-black transition-colors"
          >
            Clear all
          </button>
          <button 
            onClick={() => onApply(draftFilters)}
            className="bg-[#EC5B13] text-white px-8 py-3.5 rounded-lg font-bold text-[15px] hover:bg-[#D14F10] transition-colors"
          >
            Show {resultCount} results
          </button>
        </div>
      </div>
    </div>
  );
}
