import React from 'react';
import {
  Wifi, UtensilsCrossed, Wind, Monitor, Tv2,
  Waves, Bath, Umbrella, ChefHat, Dumbbell,
  HeartPulse, Flame, BellElectric, Shield, Trophy
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
      { id: 'wifi',      label: 'WiFi',      icon: <Wifi size={22} strokeWidth={1.6} /> },
      { id: 'kitchen',   label: 'Kitchen',   icon: <UtensilsCrossed size={22} strokeWidth={1.6} /> },
      { id: 'ac',        label: 'AC',        icon: <Wind size={22} strokeWidth={1.6} /> },
      { id: 'workspace', label: 'Workspace', icon: <Monitor size={22} strokeWidth={1.6} /> },
      { id: 'tv',        label: 'TV',        icon: <Tv2 size={22} strokeWidth={1.6} /> },
    ]
  },
  {
    id: 'luxury',
    label: 'Luxury Experience',
    categoryIcon: <Trophy size={16} className="text-[#EC5B13]" />,
    items: [
      { id: 'private_pool',  label: 'Private Pool',  icon: <Waves size={22} strokeWidth={1.6} /> },
      { id: 'hot_tub',       label: 'Hot Tub',       icon: <Bath size={22} strokeWidth={1.6} /> },
      { id: 'beachfront',    label: 'Beachfront',    icon: <Umbrella size={22} strokeWidth={1.6} /> },
      { id: 'private_chef',  label: 'Private Chef',  icon: <ChefHat size={22} strokeWidth={1.6} /> },
      { id: 'private_gym',   label: 'Private Gym',   icon: <Dumbbell size={22} strokeWidth={1.6} /> },
    ]
  },
  {
    id: 'safety',
    label: 'Safety Essentials',
    categoryIcon: <Shield size={16} className="text-[#EC5B13]" />,
    items: [
      { id: 'first_aid',    label: 'First Aid Kit',  icon: <HeartPulse size={22} strokeWidth={1.6} /> },
      { id: 'extinguisher', label: 'Extinguisher',   icon: <Flame size={22} strokeWidth={1.6} /> },
      { id: 'smoke_alarm',  label: 'Smoke Alarm',    icon: <BellElectric size={22} strokeWidth={1.6} /> },
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
