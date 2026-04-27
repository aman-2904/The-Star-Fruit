import React from 'react';
import Image from 'next/image';
import { Check, Lightbulb } from 'lucide-react';

interface CategoryItem {
  id: string;
  title: string;
  description: string;
  tag?: {
    text: string;
    type: 'popular' | 'default';
  };
  subtitle?: string;
  image: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'villa',
    title: 'Private Villa',
    description: 'Entire homes with private pools and personalized staff.',
    tag: { text: 'POPULAR', type: 'popular' },
    subtitle: 'Selected by 60% of hosts',
    image: '/images/cat_villa.png'
  },
  {
    id: 'hotel',
    title: 'Boutique Hotel',
    description: 'Refined suites, curated experiences, and premium shared amenities.',
    subtitle: 'Perfect for small resorts',
    image: '/images/cat_hotel.png'
  },
  {
    id: 'cruise',
    title: 'Luxury Cruise',
    description: 'Floating villas on the Mandovi river with private sundecks.',
    subtitle: 'Unique Goan experience',
    image: '/images/stay_cruise.png' // Utilizing existing asset
  },
  {
    id: 'apartment',
    title: 'Luxury Apartments',
    description: 'Modern high-rise stays with premium amenities and city views.',
    subtitle: 'Urban luxury experience',
    image: '/images/cat_apartment.png'
  }
];

interface Step1PropertyCategoryProps {
  selectedCategory: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
  canContinue: boolean;
  isSaving?: boolean;
}

export default function Step1PropertyCategory({ selectedCategory, onSelect, onBack, onNext, canContinue, isSaving }: Step1PropertyCategoryProps) {
  return (
    <div className="w-full max-w-5xl mx-auto px-6 md:px-12 flex flex-col h-full min-h-[600px]">
      <div className="flex-1">
        <h2 className="text-3xl md:text-4xl font-black text-[#1A1A24] mb-3 tracking-tight">What type of property are you hosting?</h2>
        <p className="text-[#6B7280] font-medium text-[15px] md:text-base mb-10 max-w-2xl leading-relaxed">
          Select the category that best describes your luxury accommodation in Goa. This helps us tailor your onboarding experience.
        </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <div 
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`relative bg-[#FDFDFD] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${isSelected ? 'border-[#EC5B13] shadow-[0_8px_30px_rgb(236,91,19,0.12)] scale-[1.02]' : 'border-gray-100 hover:border-gray-300 shadow-sm hover:shadow-md'}`}
            >
              <div className="relative h-[200px] w-full p-2">
                {isSelected && (
                  <div className="absolute top-4 right-4 z-10 w-6 h-6 bg-[#EC5B13] rounded-full flex items-center justify-center text-white shadow-md">
                    <Check size={14} strokeWidth={4} />
                  </div>
                )}
                <div className="relative w-full h-full rounded-[14px] overflow-hidden">
                  <Image 
                    src={cat.image} 
                    alt={cat.title} 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="p-6 pt-3">
                <h3 className="text-lg font-black text-[#1A1A24] mb-1">{cat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 min-h-[44px]">
                  {cat.description}
                </p>
                <div className="flex items-center gap-2">
                  {cat.tag && (
                    <span className={`text-[10px] font-black tracking-wider px-2 py-1 rounded-md ${cat.tag.type === 'popular' ? 'bg-[#FFF0E8] text-[#EC5B13]' : 'bg-gray-100 text-gray-600'}`}>
                      {cat.tag.text}
                    </span>
                  )}
                  {cat.subtitle && (
                    <span className="text-[11px] font-bold text-gray-400">
                      {cat.subtitle}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
      
      {/* Step Actions */}
      <div className="mt-16 mb-12 flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={onBack}
            className="px-6 py-3 text-sm font-bold text-gray-800 hover:bg-gray-100 bg-[#F3F4F6] rounded-xl transition-colors flex items-center gap-2"
          >
            <span>&larr;</span> Back
          </button>
          <button 
            onClick={onNext}
            disabled={!canContinue || isSaving}
            className={`px-8 py-3 text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2 ${(canContinue && !isSaving) ? 'bg-[#1A1A24] text-white hover:bg-black hover:shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'}`}
          >
            {isSaving ? 'Saving...' : <>Continue <span>&rarr;</span></>}
          </button>
        </div>
        
        <div className="bg-[#FFF8F5] rounded-xl p-5 flex items-start gap-3 border border-[#FEECE3]">
          <Lightbulb className="text-[#EC5B13] shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-gray-700 font-medium tracking-tight">
            <span className="font-bold text-black">Pro Tip:</span> Villas are currently the most searched category in North Goa. High-quality photos of your private pool can increase booking rates by up to 45%.
          </p>
        </div>
      </div>
    </div>
  );
}
