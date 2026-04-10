"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Plus, Users, BedDouble, Bath,
  Clock, CheckCircle, FileText,
  Home, ImageOff, Search, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────
interface Property {
  id: string;
  listing_title: string | null;
  category: string | null;
  city: string | null;
  state: string | null;
  status: 'draft' | 'pending_review' | 'published';
  images: string[] | null;
  max_guests: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  created_at: string;
}

// ── Status Badge ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Property['status'] }) {
  const map = {
    published:      { label: 'Published',      bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    pending_review: { label: 'Under Review',   bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500' },
    draft:          { label: 'Draft',           bg: 'bg-gray-100',    text: 'text-gray-500',    dot: 'bg-gray-400' },
  };
  const s = map[status] ?? map.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ── Property Card ───────────────────────────────────────────────────────────
function PropertyCard({ property }: { property: Property }) {
  const coverPhoto = property.images?.[0] ?? null;
  const location = [property.city, property.state].filter(Boolean).join(', ') || 'Location not set';
  const title = property.listing_title || property.category || 'Untitled Property';

  return (
    <Link
      href={`/host/dashboard/${property.id}`}
      className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group block cursor-pointer"
    >
      <div className="relative h-52 bg-gray-100">
        {coverPhoto ? (
          <Image src={coverPhoto} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-2">
            <ImageOff size={28} />
            <span className="text-xs font-medium">No photo uploaded</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <StatusBadge status={property.status} />
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-black text-[#1A1A24] text-base mb-1 line-clamp-1">{title}</h3>
        <p className="text-gray-500 text-sm font-medium mb-4">{location}</p>

        <div className="flex items-center gap-4 text-xs text-gray-500 font-semibold border-t border-gray-50 pt-4">
          {property.max_guests && (
            <span className="flex items-center gap-1">
              <Users size={12} className="text-[#EC5B13]" /> {property.max_guests}
            </span>
          )}
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <BedDouble size={12} className="text-[#EC5B13]" /> {property.bedrooms}
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath size={12} className="text-[#EC5B13]" /> {property.bathrooms}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function HostListingsPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'pending_review' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchListings() {
      if (!supabase) return;
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/auth'); return; }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('host_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!error && data) setProperties(data as Property[]);
      setLoading(false);
    }
    fetchListings();
  }, [router]);

  const filtered = properties
    .filter(p => activeTab === 'all' ? true : p.status === activeTab)
    .filter(p => {
      const searchStr = `${p.listing_title} ${p.city} ${p.category}`.toLowerCase();
      return searchStr.includes(searchQuery.toLowerCase());
    });

  const counts = {
    all: properties.length,
    published: properties.filter(p => p.status === 'published').length,
    pending_review: properties.filter(p => p.status === 'pending_review').length,
    draft: properties.filter(p => p.status === 'draft').length,
  };

  const tabs = [
    { key: 'all', label: 'All Listings', count: counts.all },
    { key: 'published', label: 'Published', count: counts.published },
    { key: 'pending_review', label: 'Under Review', count: counts.pending_review },
    { key: 'draft', label: 'Drafts', count: counts.draft },
  ] as const;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full border-4 border-[#EC5B13] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-[#1A1A24] tracking-tight">My Listings</h1>
          <p className="text-gray-500 font-medium mt-1">Manage and track your property portfolio.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search listings..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/10 focus:border-[#EC5B13] transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => router.push('/host/onboarding')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#EC5B13] text-white rounded-2xl font-bold text-sm hover:bg-[#d44f0f] transition-all shadow-lg active:scale-95"
          >
            <Plus size={18} /> Add New Property
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-[#1A1A24] text-white shadow-xl translate-y-[-2px]'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {tab.label}
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg ${
              activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-gray-100 p-20 text-center shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-6 text-gray-300">
             <Home size={32} />
          </div>
          <h3 className="text-xl font-black text-[#1A1A24] mb-2">No listings found</h3>
          <p className="text-gray-500 font-medium">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
          <button
            onClick={() => router.push('/host/onboarding')}
            className="flex flex-col items-center justify-center gap-4 h-full min-h-[320px] rounded-[32px] border-4 border-dashed border-gray-100 text-gray-400 hover:border-[#EC5B13]/20 hover:text-[#EC5B13] hover:bg-[#FFF9F7]/50 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-3xl border-2 border-current flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <p className="text-sm font-black uppercase tracking-widest">Add Property</p>
          </button>
        </div>
      )}
    </>
  );
}
