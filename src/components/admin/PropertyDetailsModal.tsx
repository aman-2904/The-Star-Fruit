"use client";

import React from "react";
import Image from "next/image";
import { X, MapPin, Users, BedDouble, Bath, ShieldCheck, Info, Globe, Calendar, User, AlignLeft, ListChecks, Phone, Mail } from "lucide-react";

interface Property {
  id: string;
  listing_title: string;
  listing_description: string;
  category: string;
  street_address: string;
  city: string;
  state: string;
  pincode: string;
  host_name: string;
  host_description: string;
  host_phone: string;
  host_email: string;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  images: string[];
  amenities: string[];
  house_rules: any;
  custom_rules: string[];
  status: string;
  created_at: string;
}

interface PropertyDetailsModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyDetailsModal({ property, isOpen, onClose }: PropertyDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        
        {/* Left Side: Images Scroll */}
        <div className="md:w-1/2 h-64 md:h-auto overflow-y-auto bg-gray-50 border-r border-gray-100 scrollbar-hide">
          <div className="grid grid-cols-1 gap-4 p-6">
            {property.images && property.images.length > 0 ? (
              property.images.map((img, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-sm">
                  <Image src={img} alt={`${property.listing_title || 'Property'} - Photo ${i + 1}`} fill className="object-cover" unoptimized />
                </div>
              ))
            ) : (
              <div className="aspect-[4/3] bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400">
                No Photos Available
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Details Content */}
        <div className="md:w-1/2 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
            <div>
               <span className="text-[10px] font-black text-[#EC5B13] uppercase tracking-[0.2em]">{property.category}</span>
               <h2 className="text-2xl font-black text-gray-900 mt-1">{property.listing_title || 'Untitled Property'}</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-8 overflow-y-auto space-y-10 flex-1 scrollbar-hide">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { icon: Users, label: 'Guests', value: property.max_guests },
                { icon: BedDouble, label: 'Beds', value: property.beds },
                { icon: User, label: 'Rooms', value: property.bedrooms },
                { icon: Bath, label: 'Baths', value: property.bathrooms }
              ].map((stat, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-gray-100/50">
                  <stat.icon size={18} className="text-[#EC5B13] mb-2" />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{stat.label}</p>
                  <p className="font-black text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Location */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <MapPin size={20} className="text-[#EC5B13]" />
                <h3>Location Details</h3>
              </div>
              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100/50">
                 <p className="text-sm font-bold text-gray-700 leading-relaxed">
                   {property.street_address}<br />
                   {property.city}, {property.state} {property.pincode}
                 </p>
              </div>
            </section>

            {/* Description */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <AlignLeft size={20} className="text-[#EC5B13]" />
                <h3>Description</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">
                {property.listing_description || 'No description provided.'}
              </p>
            </section>

            {/* Host Info */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <ShieldCheck size={20} className="text-[#EC5B13]" />
                <h3>Host Information</h3>
              </div>
              <div className="bg-white border border-gray-100 rounded-[32px] p-6 flex gap-4">
                 <div className="w-14 h-14 rounded-2xl bg-[#FFF0E8] flex items-center justify-center text-[#EC5B13] font-black text-xl">
                    {property.host_name?.[0]?.toUpperCase() || 'H'}
                 </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{property.host_name}</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">{property.host_description}</p>
                    <div className="flex flex-col gap-1 mt-3">
                      {property.host_phone && (
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                          <Phone size={12} className="text-[#EC5B13]" /> {property.host_phone}
                        </div>
                      )}
                      {property.host_email && (
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                          <Mail size={12} className="text-[#EC5B13]" /> {property.host_email}
                        </div>
                      )}
                    </div>
                  </div>
              </div>
            </section>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-gray-900 font-bold">
                  <ListChecks size={20} className="text-[#EC5B13]" />
                  <h3>Amenities</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, i) => (
                    <span key={i} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 capitalize">
                      {amenity.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* House Rules */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-gray-900 font-bold">
                <Info size={20} className="text-[#EC5B13]" />
                <h3>House Rules</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {
                  /* Standard House Rules */
                  ['smoking', 'pets', 'parties'].map((key) => {
                    const houseRules = property.house_rules || {};
                    const noKey = `no_${key}`;
                    let allowed = false;

                    // Support both old and new keys
                    if (houseRules[key] !== undefined) {
                      allowed = houseRules[key];
                    } else if (houseRules[noKey] !== undefined) {
                      allowed = !houseRules[noKey];
                    } else {
                      // Fallback default
                      return null;
                    }

                    const label = key.charAt(0).toUpperCase() + key.slice(1);
                    return (
                      <div key={key} className="flex items-center gap-3 p-3 rounded-2xl border border-gray-50">
                        <div className={`w-2 h-2 rounded-full ${allowed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className="text-xs font-bold text-gray-700">
                          {allowed ? `${label} Allowed` : `No ${label}`}
                        </span>
                      </div>
                    );
                  })
                }
                {property.custom_rules && property.custom_rules.map((rule, i) => (
                   <div key={`custom-${i}`} className="col-span-2 flex items-center gap-3 p-3 rounded-2xl border border-gray-50">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      <span className="text-xs font-bold text-gray-700">{rule}</span>
                   </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
