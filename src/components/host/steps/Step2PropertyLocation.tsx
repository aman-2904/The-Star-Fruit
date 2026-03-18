import React, { useState } from 'react';
import { Info, MapPin, Plus, Minus } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface Step2PropertyLocationProps {
  onBack: () => void;
  onNext: () => void;
  canContinue: boolean;
  // State for form
  formData: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    hostName: string;
    hostDescription: string;
  };
  setFormData: (data: any) => void;
  isSaving?: boolean;
}

export default function Step2PropertyLocation({ 
  onBack, 
  onNext, 
  canContinue,
  formData,
  setFormData,
  isSaving
}: Step2PropertyLocationProps) {
  
  const [apiKey, setApiKey] = useState("");
  const [zoom, setZoom] = useState(10);
  const activeMapKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || apiKey;

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: activeMapKey || "fallback-key-to-prevent-crash"
  });

  const goCenter = {
    lat: 15.2993,
    lng: 74.1240
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 md:px-12 flex flex-col h-full min-h-[600px] font-sans">
      <div className="flex-1">
        
        {/* Top Half: Location */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-[#1A1A24] mb-3 tracking-tight">Where's your paradise located?</h2>
            <p className="text-[#6B7280] font-medium text-[15px] mb-8 leading-relaxed">
              Help guests find your property by pinning it exactly where it stands in Goa.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Street Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="e.g. 123 Vagator Beach Road"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">City / Area</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Anjuna, North Goa"
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-sm font-medium text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="403509"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all"
                  />
                </div>
              </div>

              <div className="bg-[#FFF0E8]/60 border border-[#FEECE3] rounded-xl p-4 mt-6 flex items-start gap-3">
                <Info className="text-[#EC5B13] shrink-0 mt-0.5" size={18} />
                <p className="text-[13px] text-gray-700 font-medium leading-relaxed">
                  Your exact address is only shared with guests after they book their stay for privacy and security.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Map */}
          <div className="relative h-[400px] lg:h-full min-h-[400px] w-full bg-[#054E6D] rounded-2xl overflow-hidden shadow-lg border-2 border-transparent hover:border-[#EC5B13]/30 transition-all flex flex-col group p-4">
            
            {/* Provide the actual Google map if loaded and key exists */}
            {isLoaded && activeMapKey ? (
              <div className="absolute inset-0">
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={goCenter}
                  zoom={zoom}
                  options={{
                    disableDefaultUI: true,
                    zoomControl: false,
                  }}
                >
                  {/* Custom Map Pin Marker */}
                  <Marker 
                    position={goCenter} 
                    icon={{
                      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#EC5B13" stroke="#EC5B13" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="white"/></svg>')
                    }}
                  />
                </GoogleMap>
              </div>
            ) : (
              /* Map Placeholder UI */
              <>
                <div className="absolute inset-0 opacity-80 mix-blend-overlay" style={{ backgroundImage: 'url("/images/hero_bg.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 drop-shadow-xl animate-bounce-slow">
                  <MapPin className="text-[#EC5B13]" fill="#EC5B13" size={48} strokeWidth={1.5} />
                </div>
              </>
            )}

            {/* Map Controls */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
              <button 
                onClick={() => setZoom(z => Math.min(z + 1, 20))}
                className="w-8 h-8 bg-white rounded flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 shadow-sm border border-gray-100 transition-colors"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
              <button 
                onClick={() => setZoom(z => Math.max(z - 1, 1))}
                className="w-8 h-8 bg-white rounded flex items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 shadow-sm border border-gray-100 transition-colors"
              >
                <Minus size={16} strokeWidth={3} />
              </button>
            </div>

            {/* API Key Input (Requested by user for dynamic integration later) */}
            <div className="relative z-10 w-full mb-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <input
                 type="text"
                 placeholder="Paste Google Maps API Key here..."
                 value={apiKey}
                 onChange={(e) => setApiKey(e.target.value)}
                 className="w-full bg-white/95 backdrop-blur-sm border border-white/20 text-xs px-3 py-2 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-[#EC5B13] text-gray-800 font-medium"
               />
            </div>

            {/* Map Helper Text */}
            <div className="relative z-10 mt-auto bg-white/95 backdrop-blur-md rounded-xl p-3 flex items-center justify-center gap-2 shadow-xl border border-white/40">
              <div className="w-6 h-6 rounded-full bg-[#FFF0E8] flex items-center justify-center">
                 <MapPin size={12} className="text-[#EC5B13]" />
              </div>
              <span className="text-[11px] font-bold text-gray-800">Drag the map to position the pin exactly over your villa.</span>
            </div>
          </div>
        </div>

        {/* Bottom Half: Host Detail */}
        <div className="max-w-xl pb-8 border-t border-gray-100 pt-16">
          <h2 className="text-3xl md:text-4xl font-black text-[#1A1A24] mb-3 tracking-tight">Who's going to host the property?</h2>
          <p className="text-[#6B7280] font-medium text-[15px] mb-8 leading-relaxed">
            Help guests find who's hosting the property by adding the name and the description.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Host Name</label>
              <input
                type="text"
                name="hostName"
                value={formData.hostName}
                onChange={handleChange}
                placeholder="Cabrilla"
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Host Description</label>
              <textarea
                name="hostDescription"
                value={formData.hostDescription}
                onChange={handleChange}
                placeholder="e.g. I really like to party with people"
                rows={5}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all resize-none"
              />
            </div>
          </div>
        </div>

      </div>
      
      {/* Step Actions */}
      <div className="mt-8 mb-12 flex flex-col space-y-8 pt-8 border-t border-gray-100">
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
      </div>
    </div>
  );
}
