"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Pencil, MapPin, Users, BedDouble, Bath, Eye, Send,
  AlertCircle, X, CheckCircle, Wifi, UtensilsCrossed, Wind,
  Monitor, Tv2, Waves, Umbrella, ChefHat, Dumbbell, HeartPulse,
  Flame, BellElectric, BathIcon, WashingMachine, Refrigerator,
  Microwave, Coffee, Car, Trees, Home, Music, Zap, Baby, Ghost,
  Layout, Smartphone, Book, Gamepad2, Wine, CupSoda, Shirt, Lock,
  Shield, Thermometer, MapPinIcon, Briefcase, CalendarDays, ShowerHead,
  Phone, Mail, Sun, Moon, Bed, ConciergeBell, Sprout
} from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { PhotoItem } from './Step4PropertyPhotos';
import { Step6SpecificationsData } from './Step6Specifications';

const AMENITY_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
  // Essentials
  wifi: { label: 'WiFi', icon: <Wifi size={14} /> },
  kitchen: { label: 'Full Kitchen', icon: <UtensilsCrossed size={14} /> },
  ac: { label: 'AC', icon: <Wind size={14} /> },
  workspace: { label: 'Workspace', icon: <Monitor size={14} /> },
  tv: { label: 'TV/Netflix', icon: <Tv2 size={14} /> },
  washer: { label: 'Washer', icon: <WashingMachine size={14} /> },
  dryer: { label: 'Dryer', icon: <Wind size={14} /> },
  ethernet: { label: 'Ethernet', icon: <Zap size={14} /> },
  housekeeping: { label: 'Housekeeping', icon: <CheckCircle size={14} /> },

  // Luxury
  private_pool: { label: 'Private Pool', icon: <Waves size={14} /> },
  hot_tub: { label: 'Hot Tub', icon: <Bath size={14} /> },
  beachfront: { label: 'Beachfront', icon: <Umbrella size={14} /> },
  private_chef: { label: 'Private Chef', icon: <ChefHat size={14} /> },
  private_gym: { label: 'Private Gym', icon: <Dumbbell size={14} /> },
  bbq_grill: { label: 'BBQ Grill', icon: <Flame size={14} /> },
  sound_system: { label: 'Sound System', icon: <Music size={14} /> },
  game_console: { label: 'Game Console', icon: <Gamepad2 size={14} /> },
  barbecue: { label: 'Fire Pit', icon: <Flame size={14} /> },
  shared_pool: { label: 'Shared pool', icon: <Waves size={14} /> },
  chef_on_request: { label: 'Chef on Request', icon: <ChefHat size={14} /> },
  room_service: { label: 'Room service', icon: <ConciergeBell size={14} /> },
  massage: { label: 'Massage', icon: <Sprout size={14} /> },

  // Bathroom & Bedroom
  hair_dryer: { label: 'Hair Dryer', icon: <Wind size={14} /> },
  shampoo: { label: 'Toiletries', icon: <CupSoda size={14} /> },
  hot_water: { label: 'Hot Water', icon: <Thermometer size={14} /> },
  hangers: { label: 'Hangers', icon: <Shirt size={14} /> },
  iron: { label: 'Iron', icon: <Shirt size={14} /> },
  safe: { label: 'Room Safe', icon: <Lock size={14} /> },
  bed_linens: { label: 'Bed Linens', icon: <Home size={14} /> },
  mosquito_net: { label: 'Mosquito Net', icon: <Shield size={14} /> },
  shower_head: { label: 'Shower head', icon: <ShowerHead size={14} /> },
  towels: { label: 'Towels', icon: <Home size={14} /> },
  extra_pillows: { label: 'Extra pillows', icon: <Bed size={14} /> },
  darkening_blinds: { label: 'Room-Darkening Blinds', icon: <Moon size={14} /> },

  // Kitchen & Dining
  refrigerator: { label: 'Fridge', icon: <Refrigerator size={14} /> },
  microwave: { label: 'Microwave', icon: <Microwave size={14} /> },
  coffee_maker: { label: 'Coffee Maker', icon: <Coffee size={14} /> },
  kettle: { label: 'Electric Kettle', icon: <Coffee size={14} /> },
  cooking_basics: { label: 'Cooking Basics', icon: <UtensilsCrossed size={14} /> },
  dishwasher: { label: 'Dishwasher', icon: <WashingMachine size={14} /> },
  stove: { label: 'Stove/Cooktop', icon: <Layout size={14} /> },
  wine_glasses: { label: 'Wine Glasses', icon: <Wine size={14} /> },
  dining_table: { label: 'Dining Table', icon: <Layout size={14} /> },

  // Family & Fun
  crib: { label: 'Crib/Cot', icon: <Baby size={14} /> },
  high_chair: { label: 'High Chair', icon: <Baby size={14} /> },
  board_games: { label: 'Board Games', icon: <Ghost size={14} /> },
  books: { label: 'Books', icon: <Book size={14} /> },
  pool_table: { label: 'Pool Table', icon: <Monitor size={14} /> },

  // Facilities
  free_parking: { label: 'Free Parking', icon: <Car size={14} /> },
  ev_charger: { label: 'EV Charger', icon: <Zap size={14} /> },
  gym: { label: 'Gym access', icon: <Dumbbell size={14} /> },
  garden: { label: 'Garden/Lawn', icon: <Trees size={14} /> },
  elevator: { label: 'Elevator', icon: <Home size={14} /> },
  single_level: { label: 'Single Level', icon: <Home size={14} /> },

  // Outdoor
  patio: { label: 'Patio/Balcony', icon: <Layout size={14} /> },
  backyard: { label: 'Backyard', icon: <Trees size={14} /> },
  entrance: { label: 'Private Entry', icon: <Home size={14} /> },
  outdoor_dining: { label: 'Outdoor Dining', icon: <UtensilsCrossed size={14} /> },
  hammock: { label: 'Hammock', icon: <Umbrella size={14} /> },
  terrace: { label: 'Terrace', icon: <Layout size={14} /> },
  sun_deck: { label: 'Sun Deck', icon: <Sun size={14} /> },

  // Safety & Services
  first_aid: { label: 'First Aid Kit', icon: <HeartPulse size={14} /> },
  extinguisher: { label: 'Extinguisher', icon: <Flame size={14} /> },
  smoke_alarm: { label: 'Smoke Alarm', icon: <BellElectric size={14} /> },
  carbon_alarm: { label: 'CO Alarm', icon: <BellElectric size={14} /> },
  security_cam: { label: 'CCTV/Security', icon: <Shield size={14} /> },
  luggage_drop: { label: 'Luggage Drop', icon: <Briefcase size={14} /> },
  long_term: { label: 'Long-term Stay', icon: <CalendarDays size={14} /> },
};

interface ReviewPublishProps {
  // All collected data
  category: string | null;
  step2Data: { 
    street: string; 
    city: string; 
    state: string; 
    pincode: string; 
    hostName: string; 
    hostDescription: string;
    latitude: number;
    longitude: number;
  };
  step3Data: { guests: number; bedrooms: number; beds: number; bathrooms: number; };
  photos: PhotoItem[];
  selectedAmenities: string[];
  step6Data: Step6SpecificationsData;
  propertyId: string | null;
  // Navigation
  onBack: () => void;
  onPublish: () => Promise<void>;
  onGoToStep: (step: number) => void;
  isSaving?: boolean;
}

interface UnderReviewModalProps {
  open: boolean;
  onClose: () => void;
  coverPhoto: string | null;
  listingTitle: string;
  location: string;
}

function UnderReviewModal({ open, onClose, coverPhoto, listingTitle, location }: UnderReviewModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
            <AlertCircle size={16} />
            Listing under Approval
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full border-4 border-red-500 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={26} className="text-red-500" />
          </div>

          <h2 className="text-2xl font-black text-[#1A1A24] mb-3 leading-snug">
            Your Villa is under<br />Review!
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Your property is now under review by The Star Fruit,<br />wait for the approval.
          </p>

          {/* Property Preview Card */}
          <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm text-left mb-6">
            <div className="relative h-44 w-full bg-gray-100">
              {coverPhoto ? (
                <Image src={coverPhoto} alt="Property cover" fill className="object-cover" unoptimized />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">No photo</div>
              )}
            </div>
            <div className="px-4 py-3 flex items-end justify-between">
              <div>
                <p className="font-bold text-[#1A1A24] text-sm">{listingTitle || 'Your Property'}</p>
                <p className="text-gray-500 text-xs mt-0.5">{location}</p>
              </div>
              <span className="text-[#EC5B13] font-bold text-xs">500+ Reviews</span>
            </div>
          </div>

          {/* Status Button */}
          <button className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold text-sm cursor-default mb-3">
            Pending Confirmation
          </button>

          <button
            onClick={() => window.location.href = '/host/dashboard'}
            className="w-full py-4 bg-[#1A1A24] text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Step7ReviewPublish({
  category,
  step2Data,
  step3Data,
  photos,
  selectedAmenities,
  step6Data,
  propertyId,
  onBack,
  onPublish,
  onGoToStep,
  isSaving
}: ReviewPublishProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places'] as any
  });

  const center = {
    lat: step2Data.latitude || 15.2993,
    lng: step2Data.longitude || 74.1240
  };

  const [showModal, setShowModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const coverPhoto = photos[0]?.url || null;
  const additionalPhotos = photos.slice(1, 5);
  const extraCount = Math.max(0, photos.length - 5);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish();
      setShowModal(true);
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const EditButton = ({ step }: { step: number }) => (
    <button
      onClick={() => onGoToStep(step)}
      className="flex items-center gap-1 text-[#EC5B13] font-semibold text-sm hover:underline"
    >
      <Pencil size={13} /> Edit
    </button>
  );

  return (
    <>
      <UnderReviewModal
        open={showModal}
        onClose={() => setShowModal(false)}
        coverPhoto={coverPhoto}
        listingTitle={step6Data.title}
        location={`${step2Data.city}${step2Data.state ? ', ' + step2Data.state : ''}`}
      />

      <div className="w-full max-w-4xl mx-auto px-6 md:px-12 pb-16">
        <h2 className="text-3xl md:text-4xl font-black text-[#1A1A24] mb-2 tracking-tight">Review & Publish</h2>
        <p className="text-[#6B7280] font-medium text-[15px] mb-9 leading-relaxed">
          Review your luxury villa details one last time. Everything looks better when it's perfect.
        </p>

        <div className="space-y-5">
          {/* ── Property Overview ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#1A1A24] text-[17px]">Property Overview</h3>
                <p className="text-gray-400 text-sm mt-0.5">The core details of your heritage stay.</p>
              </div>
              <EditButton step={2} />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Host Name</p>
                <p className="text-[#1A1A24] font-semibold text-sm">{step2Data.hostName || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Listing Title</p>
                <p className="text-[#1A1A24] font-semibold text-sm">{step6Data.title || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Property Type</p>
                <p className="text-[#1A1A24] font-semibold text-sm">{category || '—'}</p>
              </div>
              {step6Data.description && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Description</p>
                  <p className="text-[#1A1A24] text-sm leading-relaxed line-clamp-4">{step6Data.description}</p>
                </div>
              )}
            </div>

            {/* Capacity Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-gray-50">
              {[
                { icon: <Users size={15} className="text-[#EC5B13]" />, value: `${step3Data.guests} Guests` },
                { icon: <BedDouble size={15} className="text-[#EC5B13]" />, value: `${step3Data.bedrooms} Bedrooms` },
                { icon: <Bath size={15} className="text-[#EC5B13]" />, value: `${step3Data.bathrooms} Baths` },
                { icon: <BedDouble size={15} className="text-[#EC5B13]" />, value: `${step3Data.beds} Beds` },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#FFF8F5] rounded-xl px-3 py-2.5">
                  {stat.icon}
                  <span className="text-[#1A1A24] font-bold text-sm">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Photo Gallery ── */}
          {photos.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-[#1A1A24] text-[17px]">Photo Gallery</h3>
                  <p className="text-gray-400 text-sm mt-0.5">Visuals that sell the experience.</p>
                </div>
                <EditButton step={4} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {/* Cover photo */}
                <div className="relative col-span-1 row-span-2 aspect-square rounded-xl overflow-hidden">
                  {coverPhoto && <Image src={coverPhoto} alt="Cover" fill className="object-cover" unoptimized />}
                  <div className="absolute top-2 left-2 bg-[#EC5B13] text-white text-[9px] font-black tracking-widest px-2 py-1 rounded-md uppercase">
                    Cover Photo
                  </div>
                </div>
                {/* Additional photos */}
                {additionalPhotos.map((photo, i) => {
                  const isLast = i === additionalPhotos.length - 1 && extraCount > 0;
                  return (
                    <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden">
                      <Image src={photo.url} alt={`Photo ${i + 2}`} fill className="object-cover" unoptimized />
                      {isLast && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">+{extraCount} More</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Location ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#1A1A24] text-[17px]">Location</h3>
                <p className="text-gray-400 text-sm mt-0.5">
                  {step2Data.city}{step2Data.state ? ', ' + step2Data.state : ''}
                </p>
              </div>
              <EditButton step={2} />
            </div>
            <div className="flex gap-5 items-start">
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Address</p>
                  <div className="flex items-start gap-2 text-[#1A1A24] text-sm font-medium">
                    <MapPin size={14} className="text-[#EC5B13] mt-0.5 shrink-0" />
                    <span>{[step2Data.street, step2Data.city, step2Data.state, step2Data.pincode].filter(Boolean).join(', ')}</span>
                  </div>
                </div>
              </div>
              {/* Map preview */}
              <div className="hidden sm:flex w-52 h-32 bg-gray-100 rounded-xl items-center justify-center shrink-0 overflow-hidden relative shadow-inner border border-gray-100">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={center}
                    zoom={15}
                    options={{
                      disableDefaultUI: true,
                      zoomControl: false,
                      gestureHandling: 'none',
                      draggable: false,
                    }}
                  >
                    <Marker 
                      position={center} 
                      icon={{
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#EC5B13" stroke="#EC5B13" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="white"/></svg>')
                      }}
                    />
                  </GoogleMap>
                ) : (
                  <div className="text-gray-400 text-xs text-center px-2">
                    <MapPin size={20} className="mx-auto mb-1 text-[#EC5B13]" />
                    {step2Data.city || 'Location'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Amenities ── */}
          {selectedAmenities.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-[#1A1A24] text-[17px]">Amenities & Features</h3>
                  <p className="text-gray-400 text-sm mt-0.5">Every luxury convenience accounted for.</p>
                </div>
                <EditButton step={5} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
                {selectedAmenities.map(id => {
                  const amenity = AMENITY_LABELS[id];
                  const label = amenity?.label || id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                  const icon = amenity?.icon || <CheckCircle size={14} />;
                  return (
                    <div key={id} className="flex items-center gap-2 text-sm text-[#374151]">
                      <span className="text-[#EC5B13]">{icon}</span>
                      <span className="font-medium">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── House Rules ── */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-[#1A1A24] text-[17px]">House Rules</h3>
                <p className="text-gray-400 text-sm mt-0.5">Guidelines for guest behavior.</p>
              </div>
              <EditButton step={6} />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Standard Rules */}
              {['smoking', 'pets', 'parties'].map(key => {
                const isAllowed = step6Data.houseRules[key];
                const label = key.charAt(0).toUpperCase() + key.slice(1);
                return (
                  <div key={key} className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-4 py-3">
                    <div className={`w-2 h-2 rounded-full ${isAllowed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="text-sm font-semibold text-[#1A1A24]">
                      {isAllowed ? `${label} Allowed` : `No ${label}`}
                    </span>
                  </div>
                );
              })}
              
              {/* Custom Rules */}
              {step6Data.customRules.map((rule, i) => (
                <div key={i} className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-sm font-semibold text-[#1A1A24]">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Ready to go live footer bar ── */}
        <div className="mt-8 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF0E8] flex items-center justify-center shrink-0">
              <CheckCircle size={20} className="text-[#EC5B13]" />
            </div>
            <div>
              <p className="font-bold text-[#1A1A24] text-sm">Ready to go live?</p>
              <p className="text-gray-500 text-xs mt-0.5">Once published, your villa will be visible to thousands of travelers.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              <Eye size={14} /> Preview as Guest
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing || isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-[#EC5B13] text-white rounded-xl font-bold text-sm hover:bg-[#d44f0f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
            >
              <Send size={14} />
              {isPublishing ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
