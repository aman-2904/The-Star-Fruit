import React from 'react';
import {
  Wifi, UtensilsCrossed, Wind, Monitor, Tv2,
  Waves, Bath, Umbrella, ChefHat, Dumbbell,
  HeartPulse, Flame, BellElectric, Shield, Trophy,
  WashingMachine, Refrigerator, Microwave, Coffee,
  Shovel, Car, Trees, Home, Music, UserCheck,
  Zap, Baby, Ghost, Layout,
  Smartphone, Book, Gamepad2, GraduationCap,
  Beer, Wine, CupSoda, Shirt, DoorOpen, Lock,
  Thermometer, Fan, Speaker, MapPin,
  CalendarDays, Briefcase, Boxes, ShowerHead,
  Soup
} from 'lucide-react';

interface Amenity {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface AmenityCategory {
  id: string;
  label: string;
  categoryIcon: React.ReactNode;
  items: Amenity[];
}

const CATEGORIES: AmenityCategory[] = [
  {
    id: 'essentials',
    label: 'Essentials',
    categoryIcon: <Wifi size={16} className="text-[#EC5B13]" />,
    items: [
      { id: 'wifi',         label: 'WiFi',            icon: <Wifi size={22} strokeWidth={1.6} /> },
      { id: 'ac',           label: 'AC',              icon: <Wind size={22} strokeWidth={1.6} /> },
      { id: 'tv',           label: 'TV/Netflix',      icon: <Tv2 size={22} strokeWidth={1.6} /> },
      { id: 'workspace',    label: 'Workspace',       icon: <Monitor size={22} strokeWidth={1.6} /> },
      { id: 'washer',       label: 'Washer',          icon: <WashingMachine size={22} strokeWidth={1.6} /> },
      { id: 'dryer',        label: 'Dryer',           icon: <Wind size={22} strokeWidth={1.6} /> },
      { id: 'ethernet',     label: 'Ethernet',        icon: <Zap size={22} strokeWidth={1.6} /> },
      { id: 'housekeeping', label: 'Housekeeping',    icon: <UserCheck size={22} strokeWidth={1.6} /> },
    ]
  },
  {
    id: 'luxury',
    label: 'Luxury Experience',
    categoryIcon: <Trophy size={16} className="text-[#EC5B13]" />,
    items: [
      { id: 'private_pool',  label: 'Private Pool',   icon: <Waves size={22} strokeWidth={1.6} /> },
      { id: 'hot_tub',       label: 'Hot Tub/Jacuzzi', icon: <Bath size={22} strokeWidth={1.6} /> },
      { id: 'beachfront',    label: 'Beachfront',     icon: <Umbrella size={22} strokeWidth={1.6} /> },
      { id: 'private_chef',  label: 'Private Chef',   icon: <ChefHat size={22} strokeWidth={1.6} /> },
      { id: 'private_gym',   label: 'Private Gym',    icon: <Dumbbell size={22} strokeWidth={1.6} /> },
      { id: 'bbq_grill',     label: 'BBQ Grill',      icon: <Flame size={22} strokeWidth={1.6} /> },
      { id: 'sound_system',  label: 'Sound System',   icon: <Music size={22} strokeWidth={1.6} /> },
      { id: 'game_console',  label: 'Game Console',   icon: <Gamepad2 size={22} strokeWidth={1.6} /> },
      { id: 'barbecue',      label: 'Fire Pit',       icon: <Flame size={22} strokeWidth={1.6} /> },
    ]
  },
  {
    id: 'bathroom_bedroom',
    label: 'Bathroom & Bedroom',
    categoryIcon: <Bath size={16} className="text-[#EC5B13]" />,
    items: [
      { id: 'hair_dryer',   label: 'Hair Dryer',     icon: <Wind size={22} strokeWidth={1.6} /> },
      { id: 'shampoo',      label: 'Toiletries',     icon: <CupSoda size={22} strokeWidth={1.6} /> },
      { id: 'hot_water',    label: 'Hot Water',      icon: <Thermometer size={22} strokeWidth={1.6} /> },
      { id: 'hangers',      label: 'Hangers',        icon: <Shirt size={22} strokeWidth={1.6} /> },
      { id: 'iron',         label: 'Iron',           icon: <Shirt size={22} strokeWidth={1.6} /> },
      { id: 'safe',         label: 'Room Safe',      icon: <Lock size={22} strokeWidth={1.6} /> },
      { id: 'bed_linens',   label: 'Bed Linens',     icon: <Home size={22} strokeWidth={1.6} /> },
      { id: 'mosquito_net', label: 'Mosquito Net',   icon: <Shield size={22} strokeWidth={1.6} /> },
      { id: 'shower_head',  label: 'Shower head',    icon: <ShowerHead size={22} strokeWidth={1.6} /> },
      { id: 'towels',       label: 'Towels',         icon: <Home size={22} strokeWidth={1.6} /> },
    ]
  },
  {
    id: 'kitchen_dining',
    label: 'Kitchen & Dining',
    categoryIcon: <UtensilsCrossed size={16} className="text-[#EC5B13]" />,
    items: [
      { id: 'kitchen',      label: 'Full Kitchen',    icon: <UtensilsCrossed size={22} strokeWidth={1.6} /> },
      { id: 'refrigerator', label: 'Fridge',          icon: <Refrigerator size={22} strokeWidth={1.6} /> },
      { id: 'microwave',    label: 'Microwave',       icon: <Microwave size={22} strokeWidth={1.6} /> },
      { id: 'coffee_maker', label: 'Coffee Maker',    icon: <Coffee size={22} strokeWidth={1.6} /> },
      { id: 'kettle',       label: 'Electric Kettle', icon: <Coffee size={22} strokeWidth={1.6} /> },
      { id: 'cooking_basics', label: 'Cooking Basics', icon: <UtensilsCrossed size={22} strokeWidth={1.6} /> },
      { id: 'dishwasher',   label: 'Dishwasher',      icon: <WashingMachine size={22} strokeWidth={1.6} /> },
      { id: 'stove',        label: 'Stove/Cooktop',   icon: <Layout size={22} strokeWidth={1.6} /> },
      { id: 'wine_glasses', label: 'Wine Glasses',    icon: <Wine size={22} strokeWidth={1.6} /> },
      { id: 'dining_table', label: 'Dining Table',    icon: <Layout size={22} strokeWidth={1.6} /> },
    ]
  },
  {
    id: 'family_entertainment',
    label: 'Family & Fun',
    categoryIcon: <Baby size={16} className="text-[#EC5B13]" />,
    items: [
      { id: 'crib',         label: 'Crib/Cot',        icon: <Baby size={22} strokeWidth={1.6} /> },
      { id: 'high_chair',   label: 'High Chair',      icon: <Baby size={22} strokeWidth={1.6} /> },
      { id: 'board_games',  label: 'Board Games',     icon: <Ghost size={22} strokeWidth={1.6} /> },
      { id: 'books',        label: 'Books',           icon: <Book size={22} strokeWidth={1.6} /> },
      { id: 'pool_table',   label: 'Pool Table',      icon: <Monitor size={22} strokeWidth={1.6} /> },
    ]
  },
  {
    id: 'parking_facilities',
    label: 'Parking & Facilities',
    categoryIcon: <Car size={16} className="text-[#EC5B13]" />,
    items: [
      { id: 'free_parking', label: 'Free Parking',    icon: <Car size={22} strokeWidth={1.6} /> },
      { id: 'ev_charger',   label: 'EV Charger',      icon: <Zap size={22} strokeWidth={1.6} /> },
      { id: 'gym',          label: 'Gym access',      icon: <Dumbbell size={22} strokeWidth={1.6} /> },
      { id: 'garden',       label: 'Garden/Lawn',     icon: <Trees size={22} strokeWidth={1.6} /> },
      { id: 'elevator',     label: 'Elevator',        icon: <Home size={22} strokeWidth={1.6} /> },
      { id: 'single_level', label: 'Single Level',    icon: <Home size={22} strokeWidth={1.6} /> },
    ]
  },
  {
    id: 'outdoor',
    label: 'Outdoor & Views',
    categoryIcon: <Home size={16} className="text-[#EC5B13]" />,
    items: [
      { id: 'patio',        label: 'Patio/Balcony',   icon: <Layout size={22} strokeWidth={1.6} /> },
      { id: 'backyard',     label: 'Backyard',        icon: <Trees size={22} strokeWidth={1.6} /> },
      { id: 'entrance',     label: 'Private Entry',   icon: <Home size={22} strokeWidth={1.6} /> },
      { id: 'outdoor_dining', label: 'Outdoor Dining', icon: <UtensilsCrossed size={22} strokeWidth={1.6} /> },
      { id: 'hammock',      label: 'Hammock',         icon: <Umbrella size={22} strokeWidth={1.6} /> },
    ]
  },
  {
    id: 'safety_services',
    label: 'Safety & Services',
    categoryIcon: <Shield size={16} className="text-[#EC5B13]" />,
    items: [
      { id: 'first_aid',    label: 'First Aid Kit',   icon: <HeartPulse size={22} strokeWidth={1.6} /> },
      { id: 'extinguisher', label: 'Extinguisher',    icon: <Flame size={22} strokeWidth={1.6} /> },
      { id: 'smoke_alarm',  label: 'Smoke Alarm',     icon: <BellElectric size={22} strokeWidth={1.6} /> },
      { id: 'carbon_alarm', label: 'CO Alarm',        icon: <BellElectric size={22} strokeWidth={1.6} /> },
      { id: 'security_cam', label: 'CCTV/Security',   icon: <Shield size={22} strokeWidth={1.6} /> },
      { id: 'luggage_drop', label: 'Luggage Drop',    icon: <Briefcase size={22} strokeWidth={1.6} /> },
      { id: 'long_term',    label: 'Long-term Stay',  icon: <CalendarDays size={22} strokeWidth={1.6} /> },
    ]
  }
];

export interface Step5AmenitiesFeaturesProps {
  selectedAmenities: string[];
  setSelectedAmenities: React.Dispatch<React.SetStateAction<string[]>>;
  onBack: () => void;
  onNext: () => void;
  canContinue: boolean;
  isSaving?: boolean;
}

export default function Step5AmenitiesFeatures({
  selectedAmenities,
  setSelectedAmenities,
  onBack,
  onNext,
  canContinue,
  isSaving
}: Step5AmenitiesFeaturesProps) {

  const toggle = (id: string) => {
    setSelectedAmenities(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-12 flex flex-col min-h-[600px]">
      <div className="flex-1">

        {/* Motivational Subheader */}
        <p className="text-[#EC5B13] font-semibold text-sm mb-3 tracking-wide">
          Almost there! Your luxury listing is nearly ready.
        </p>

        <h2 className="text-3xl md:text-4xl font-black text-[#1A1A24] mb-3 tracking-tight">
          Tell guests what your place has to offer
        </h2>
        <p className="text-[#6B7280] font-medium text-[15px] mb-10 leading-relaxed max-w-2xl">
          High end amenities attract premium guests. You can add more details after you publish your listing.
        </p>

        {/* Amenity Categories */}
        <div className="space-y-10">
          {CATEGORIES.map(category => (
            <div key={category.id}>
              {/* Category Header */}
              <div className="flex items-center gap-2 mb-4">
                {category.categoryIcon}
                <h3 className="text-[#1A1A24] font-bold text-[17px]">{category.label}</h3>
              </div>

              {/* Amenity Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {category.items.map(amenity => {
                  const isSelected = selectedAmenities.includes(amenity.id);
                  return (
                    <button
                      key={amenity.id}
                      onClick={() => toggle(amenity.id)}
                      className={`flex flex-col items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'border-[#EC5B13] bg-[#FFF8F5]'
                          : 'border-gray-100 bg-white hover:border-gray-300 shadow-sm'
                      }`}
                    >
                      <span className={`transition-colors ${isSelected ? 'text-[#EC5B13]' : 'text-[#6B7280]'}`}>
                        {amenity.icon}
                      </span>
                      <span className={`text-sm font-semibold transition-colors ${isSelected ? 'text-[#1A1A24]' : 'text-[#374151]'}`}>
                        {amenity.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Actions */}
      <div className="mt-16 mb-12 flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 text-sm font-bold text-gray-800 hover:bg-gray-100 bg-[#F3F4F6] rounded-xl transition-colors flex items-center gap-2"
        >
          <span>&larr;</span> Back
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue || isSaving}
          className={`px-8 py-3 text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2 ${
            (canContinue && !isSaving)
              ? 'bg-[#1A1A24] text-white hover:bg-black hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
          }`}
        >
          {isSaving ? 'Saving...' : <>Continue <span>&rarr;</span></>}
        </button>
      </div>
    </div>
  );
}
