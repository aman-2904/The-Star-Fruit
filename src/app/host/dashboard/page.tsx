"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus, Users, BedDouble, Bath,
  Clock, CheckCircle, FileText,
  Home, ImageOff, ChevronRight, LayoutDashboard, MessageSquare
} from 'lucide-react';
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
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${s.bg} ${s.text}`}>
      <span className={`w-1 h-1 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ── Property Preview Card ──────────────────────────────────────────────────
function PropertyPreview({ property }: { property: Property }) {
  const coverPhoto = property.images?.[0] ?? null;
  const location = [property.city, property.state].filter(Boolean).join(', ') || 'Location unset';
  const title = property.listing_title || property.category || 'Untitled';

  return (
    <Link
      href={`/host/dashboard/${property.id}`}
      className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
    >
      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
        {coverPhoto ? (
          <Image src={coverPhoto} alt={title} fill className="object-cover" unoptimized />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
            <ImageOff size={18} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-[#1A1A24] text-sm truncate">{title}</h4>
        <p className="text-[11px] text-gray-500 font-medium truncate">{location}</p>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-2">
        <StatusBadge status={property.status} />
        <ChevronRight size={14} className="text-gray-300 group-hover:text-[#EC5B13] group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

// ── Stats Summary ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 flex items-center gap-5">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-black text-[#1A1A24]">{value}</p>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

export default function HostDashboardPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [hostName, setHostName] = useState('Host');

  useEffect(() => {
    async function load() {
      if (!supabase) { setLoading(false); return; }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/auth'); return; }

      setHostName(session.user.user_metadata?.full_name || 'Host');

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('host_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!error && data) setProperties(data as Property[]);
      setLoading(false);
    }
    load();
  }, [router]);

  const counts = {
    all: properties.length,
    published: properties.filter(p => p.status === 'published').length,
    pending_review: properties.filter(p => p.status === 'pending_review').length,
    draft: properties.filter(p => p.status === 'draft').length,
  };

  const recentListings = properties.slice(0, 4);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full border-4 border-[#EC5B13] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-black text-[#1A1A24] tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-500 font-medium mt-1">
            Welcome back, <span className="font-bold text-[#1A1A24] capitalize">{hostName}</span>. Here's what's happening.
          </p>
        </div>
        <button
          onClick={() => router.push('/host/onboarding')}
          className="flex items-center gap-2 px-6 py-3.5 bg-[#1A1A24] text-white rounded-2xl font-bold text-sm hover:shadow-xl hover:translate-y-[-2px] transition-all self-start sm:self-auto"
        >
          <Plus size={18} /> New Listing
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<Home size={22} className="text-[#EC5B13]" />} label="Total Assets" value={counts.all} color="bg-[#FFF0E8]" />
        <StatCard icon={<CheckCircle size={22} className="text-emerald-600" />} label="Live" value={counts.published} color="bg-emerald-50" />
        <StatCard icon={<Clock size={22} className="text-amber-600" />} label="Refining" value={counts.pending_review} color="bg-amber-50" />
        <StatCard icon={<FileText size={22} className="text-gray-500" />} label="Drafts" value={counts.draft} color="bg-gray-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Listings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#1A1A24]">Recent Listings</h3>
            <Link href="/host/listings" className="text-sm font-bold text-[#EC5B13] hover:underline flex items-center gap-1">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          
          {recentListings.length === 0 ? (
            <div className="bg-white rounded-[32px] border border-dashed border-gray-200 p-12 text-center">
              <p className="text-gray-400 font-bold mb-4">No properties listed yet.</p>
              <button onClick={() => router.push('/host/onboarding')} className="text-sm font-bold text-[#EC5B13] hover:underline px-4 py-2 bg-[#FFF0E8] rounded-xl">
                 Create your first listing
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentListings.map(p => <PropertyPreview key={p.id} property={p} />)}
            </div>
          )}
        </div>

        {/* Quick Actions / Activity */}
        <div className="space-y-6">
           <h3 className="text-xl font-black text-[#1A1A24]">Quick Actions</h3>
           <div className="bg-white rounded-[32px] border border-gray-100 p-6 space-y-4 shadow-sm">
             <button onClick={() => router.push('/host/enquiries')} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-[#FFF0E8] transition-all group">
               <div className="flex items-center gap-3">
                 <MessageSquare size={18} className="text-gray-400 group-hover:text-[#EC5B13]" />
                 <span className="text-sm font-bold text-[#1A1A24]">Check messages</span>
               </div>
               <ChevronRight size={16} className="text-gray-300" />
             </button>
             <button onClick={() => router.push('/host/onboarding')} className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-[#FFF0E8] transition-all group">
               <div className="flex items-center gap-3">
                 <Plus size={18} className="text-gray-400 group-hover:text-[#EC5B13]" />
                 <span className="text-sm font-bold text-[#1A1A24]">Add properties</span>
               </div>
               <ChevronRight size={16} className="text-gray-300" />
             </button>
           </div>
        </div>
      </div>
    </>
  );
}
