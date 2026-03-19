"use client";

import React from 'react';
import Image from 'next/image';
import { CheckCircle, XCircle, MapPin, Users, BedDouble, Bath, Globe } from 'lucide-react';

interface Property {
  id: string;
  listing_title: string;
  category: string;
  street_address: string;
  city: string;
  state: string;
  host_name: string;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  status: string;
  created_at: string;
}

interface PropertyApproveCardProps {
  property: Property;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onRevoke: (id: string) => Promise<void>;
  onClick: () => void;
  layout?: 'grid' | 'list';
}

export default function PropertyApproveCard({ 
  property, 
  onApprove, 
  onReject, 
  onRevoke, 
  onClick,
  layout = 'grid'
}: PropertyApproveCardProps) {
  const [loading, setLoading] = React.useState(false);

  const handleApprove = async () => {
    setLoading(true);
    await onApprove(property.id);
    setLoading(false);
  };

  const handleReject = async () => {
    setLoading(true);
    await onReject(property.id);
    setLoading(false);
  };

  const coverImage = property.images?.[0] || null;

  if (layout === 'list') {
    return (
      <div 
        onClick={onClick}
        className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-black/5 transition-all duration-300 group cursor-pointer flex flex-col md:flex-row"
      >
        <div className="relative w-full md:w-64 h-48 md:h-auto overflow-hidden">
          {coverImage ? (
            <Image 
              src={coverImage} 
              alt={property.listing_title || 'Property Image'} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          <div className="absolute top-3 left-3">
             <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-full shadow-sm">
               <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest">{property.category}</span>
             </div>
          </div>
        </div>

        <div className="flex-1 p-6 flex flex-col justify-between">
           <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                   <h3 className="text-lg font-bold text-gray-900 leading-tight">{property.listing_title || 'Untitled Property'}</h3>
                   <div className={`px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      property.status === 'published' ? 'bg-emerald-500 text-white' : 
                      property.status === 'pending_review' ? 'bg-amber-500 text-white' : 
                      property.status === 'rejected' ? 'bg-red-500 text-white' :
                      'bg-gray-500 text-white'
                   }`}>
                      <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                      <span className="text-[8px] font-black uppercase tracking-widest">
                        {property.status === 'pending_review' ? 'Pending' : property.status}
                      </span>
                   </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <MapPin size={12} className="text-[#EC5B13]" />
                  <span className="text-[11px] font-semibold">{property.city}, {property.state}</span>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex flex-col items-end">
                   <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Host</p>
                   <p className="text-xs font-bold text-gray-900 capitalize">{property.host_name}</p>
                </div>
              </div>
           </div>

           <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-50">
              <div className="flex items-center gap-6">
                 <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">{property.max_guests} Guests</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <BedDouble size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">{property.bedrooms} Beds</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <Bath size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">{property.bathrooms} Baths</span>
                 </div>
              </div>

              <div className="flex-1 flex justify-end gap-3">
                {property.status === 'published' ? (
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-[10px] border border-emerald-100 flex items-center gap-2">
                       <CheckCircle size={14} /> Published
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onRevoke(property.id); }}
                      disabled={loading}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-[10px] border border-red-100 hover:bg-red-100 transition-all"
                    >
                      Revoke
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleApprove(); }}
                      disabled={loading}
                      className="px-6 py-2.5 bg-[#EC5B13] text-white rounded-xl font-bold text-xs hover:bg-[#d44f0f] transition-all flex items-center gap-2"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleReject(); }}
                      disabled={loading}
                      className="p-2.5 border border-gray-200 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all"
                    >
                      <XCircle size={16} />
                    </button>
                  </>
                )}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[28px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-300 group cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        {coverImage ? (
          <Image 
            src={coverImage} 
            alt={property.listing_title || 'Property Image'} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            No Image Available
          </div>
        )}
        <div className="absolute top-4 left-4">
          <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm max-w-fit">
            <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{property.category}</span>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <div className={`px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 ${
            property.status === 'published' ? 'bg-emerald-500 text-white' : 
            property.status === 'pending_review' ? 'bg-amber-500 text-white' : 
            property.status === 'rejected' ? 'bg-red-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {property.status === 'pending_review' ? 'Pending' : property.status}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{property.listing_title || 'Untitled Property'}</h3>
            <div className="flex items-center gap-1.5 text-gray-500 mt-1">
              <MapPin size={12} className="text-[#EC5B13]" />
              <span className="text-[11px] font-semibold">{property.city}, {property.state}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Host</p>
            <p className="text-xs font-bold text-gray-900 capitalize">{property.host_name}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2.5 py-1.5">
            <Users size={12} className="text-gray-400" />
            <span className="text-[11px] font-bold text-gray-700">{property.max_guests}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2.5 py-1.5">
            <BedDouble size={12} className="text-gray-400" />
            <span className="text-[11px] font-bold text-gray-700">{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-2.5 py-1.5">
            <Bath size={12} className="text-gray-400" />
            <span className="text-[11px] font-bold text-gray-700">{property.bathrooms}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {property.status === 'published' ? (
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-xs border border-emerald-100">
                <CheckCircle size={16} />
                Published
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onRevoke(property.id); }}
                disabled={loading}
                className="flex-none px-4 py-3 bg-red-50 text-red-600 rounded-2xl font-bold text-xs border border-red-100 hover:bg-red-100 transition-all disabled:opacity-50"
                title="Revoke Publication"
              >
                Revoke
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handleApprove(); }}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#EC5B13] text-white rounded-2xl font-bold text-xs hover:bg-[#d44f0f] transition-all disabled:opacity-50"
              >
                <CheckCircle size={16} />
                Approve
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleReject(); }}
                disabled={loading}
                className="flex-none p-3 border border-gray-200 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all disabled:opacity-50"
              >
                <XCircle size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
