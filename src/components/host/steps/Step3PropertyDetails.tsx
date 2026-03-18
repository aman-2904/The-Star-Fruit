import React from 'react';
import { Users, BedDouble, BedSingle, Bath, Minus, Plus } from 'lucide-react';

export interface Step3PropertyDetailsProps {
  formData: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  }>>;
  onBack: () => void;
  onNext: () => void;
  canContinue: boolean;
  isSaving?: boolean;
}

export default function Step3PropertyDetails({ 
  formData, 
  setFormData, 
  onBack, 
  onNext, 
  canContinue,
  isSaving
}: Step3PropertyDetailsProps) {

  const updateCounter = (field: keyof typeof formData, increment: number) => {
    setFormData(prev => ({
      ...prev,
      // Ensure values don't go below 1 (or 0 if appropriate, let's use 1 for minimums, maybe 0 for bathrooms? 1 makes sense for a listed property)
      [field]: Math.max(1, prev[field] + increment) 
    }));
  };

  const counterRows = [
    {
      id: 'guests' as const,
      title: 'Guests',
      subtitle: 'Total number of people allowed',
      icon: <Users className="text-[#EC5B13]" size={20} strokeWidth={2} />
    },
    {
      id: 'bedrooms' as const,
      title: 'Bedrooms',
      subtitle: 'Number of private sleeping areas',
      icon: <BedDouble className="text-[#EC5B13]" size={20} strokeWidth={2} />
    },
    {
      id: 'beds' as const,
      title: 'Beds',
      subtitle: 'Total sleeping spots available',
      icon: <BedSingle className="text-[#EC5B13]" size={20} strokeWidth={2} />
    },
    {
      id: 'bathrooms' as const,
      title: 'Bathrooms',
      subtitle: 'Full or half bathrooms',
      icon: <Bath className="text-[#EC5B13]" size={20} strokeWidth={2} />
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-12 flex flex-col h-full min-h-[600px]">
      <div className="flex-1 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-black text-[#1A1A24] mb-3 tracking-tight">Share the basics about your place</h2>
        <p className="text-[#6B7280] font-medium text-[15px] md:text-base mb-10 leading-relaxed">
          Tell us how many people can stay and what the layout looks like. This helps guests decide if your home is right for them.
        </p>

        <div className="space-y-4">
          {counterRows.map((row) => (
            <div key={row.id} className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              
              {/* Left side: Icon & Text */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#FFF0E8] rounded-xl flex items-center justify-center shrink-0">
                  {row.icon}
                </div>
                <div>
                  <h3 className="text-[#1A1A24] font-bold text-[17px] tracking-tight">{row.title}</h3>
                  <p className="text-gray-500 text-sm mt-0.5">{row.subtitle}</p>
                </div>
              </div>

              {/* Right side: Controls */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => updateCounter(row.id, -1)}
                  disabled={formData[row.id] <= 1}
                  className={`w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center transition-colors ${formData[row.id] <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:border-gray-800 text-gray-500 hover:text-black'}`}
                >
                  <Minus size={16} strokeWidth={2.5} />
                </button>
                
                <span className="w-6 text-center text-[17px] font-bold text-[#1A1A24]">
                  {formData[row.id]}
                </span>
                
                <button 
                  onClick={() => updateCounter(row.id, 1)}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-800 hover:text-black transition-colors"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>
      
      {/* Step Actions */}
      <div className="mt-16 mb-12 flex items-center justify-between pb-8">
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
    </div>
  );
}
