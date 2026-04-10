"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus, User, Globe, Users, BedDouble, Bath,
  Clock, CheckCircle, FileText,
  Home, LayoutDashboard, ListChecks, HelpCircle,
  Menu, X, ImageOff, MessageSquare
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
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ── Empty State ─────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-3xl bg-[#FFF0E8] flex items-center justify-center mb-6">
        <Home size={32} className="text-[#EC5B13]" />
      </div>
      <h3 className="text-xl font-black text-[#1A1A24] mb-2">No listings yet</h3>
      <p className="text-gray-500 font-medium mb-8 max-w-xs leading-relaxed">
        You haven't listed any properties yet. Add your first luxury property to get started.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-6 py-3 bg-[#EC5B13] text-white rounded-2xl font-bold text-sm hover:bg-[#d44f0f] transition-colors shadow-md"
      >
        <Plus size={16} /> Add Your First Property
      </button>
    </div>
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
      {/* Cover Photo */}
      <div className="relative h-52 bg-gray-100">
        {coverPhoto ? (
          <Image src={coverPhoto} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 gap-2">
            <ImageOff size={28} />
            <span className="text-xs font-medium">No photo uploaded</span>
          </div>
        )}
        {/* Status badge overlay */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={property.status} />
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="font-black text-[#1A1A24] text-base mb-1 line-clamp-1">{title}</h3>
        <p className="text-gray-500 text-sm font-medium mb-4">{location}</p>

        {/* Stats */}
        {(property.max_guests || property.bedrooms || property.bathrooms) ? (
          <div className="flex items-center gap-4 text-xs text-gray-500 font-semibold border-t border-gray-50 pt-4">
            {property.max_guests && (
              <span className="flex items-center gap-1">
                <Users size={12} className="text-[#EC5B13]" /> {property.max_guests} Guests
              </span>
            )}
            {property.bedrooms && (
              <span className="flex items-center gap-1">
                <BedDouble size={12} className="text-[#EC5B13]" /> {property.bedrooms} Beds
              </span>
            )}
            {property.bathrooms && (
              <span className="flex items-center gap-1">
                <Bath size={12} className="text-[#EC5B13]" /> {property.bathrooms} Baths
              </span>
            )}
          </div>
        ) : (
          <p className="text-xs text-gray-400 font-medium border-t border-gray-50 pt-4">Details incomplete</p>
        )}
      </div>
    </Link>
  );
}

// ── Stats Summary ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-black text-[#1A1A24]">{value}</p>
        <p className="text-xs text-gray-500 font-semibold">{label}</p>
      </div>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────────────────
export default function HostDashboardPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [hostName, setHostName] = useState('Host');
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'pending_review' | 'draft'>('all');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    async function load() {
      if (!supabase) { setLoading(false); return; }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/auth'); return; }

      const user = session.user;
      if (user.user_metadata?.role === 'user') {
        router.push("/");
        return;
      }
      setHostName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Host');

      const { data, error } = await supabase
        .from('properties')
        .select('id, listing_title, category, city, state, status, images, max_guests, bedrooms, bathrooms, created_at')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) setProperties(data as Property[]);
      setLoading(false);
    }
    load();
  }, [router]);

  const handleLogout = async () => {
    if (supabase) { await supabase.auth.signOut(); router.push('/'); }
  };

  const filtered = activeTab === 'all' ? properties : properties.filter(p => p.status === activeTab);

  const counts = {
    all: properties.length,
    published: properties.filter(p => p.status === 'published').length,
    pending_review: properties.filter(p => p.status === 'pending_review').length,
    draft: properties.filter(p => p.status === 'draft').length,
  };

  const TAB_CONFIG = [
    { key: 'all',            label: 'All Listings',  count: counts.all },
    { key: 'published',      label: 'Published',     count: counts.published },
    { key: 'pending_review', label: 'Under Review',  count: counts.pending_review },
    { key: 'draft',          label: 'Drafts',        count: counts.draft },
  ] as const;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <div className="w-10 h-10 rounded-full border-4 border-[#EC5B13] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200/60 px-6 md:px-12 py-4 flex items-center justify-between">
        {/* Left nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-1.5">
            <Home size={15} /> Home
          </Link>
          <Link href="/host/dashboard" className="text-sm font-bold text-[#EC5B13] flex items-center gap-1.5">
            <LayoutDashboard size={15} /> Dashboard
          </Link>
          <Link href="/host/enquiries" className="text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-1.5">
            <MessageSquare size={15} /> Enquiries
          </Link>
          <Link href="#" className="text-sm font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-1.5">
            <ListChecks size={15} /> Listings
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 -ml-2 text-gray-700" onClick={() => setShowMobileMenu(p => !p)}>
          {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/host">
            <Image src="/images/logo.png" alt="The Star Fruit" width={140} height={35} className="h-8 w-auto" />
          </Link>
        </div>

        {/* Right nav */}
        <div className="flex items-center gap-4">
          <Link href="#" className="hidden md:flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-black">
            <HelpCircle size={15} /> Help
          </Link>
          {/* Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(p => !p)}
              className="flex items-center gap-2"
            >
              <span className="hidden sm:block text-sm font-bold text-gray-700">
                {hostName}
              </span>
              <div className="w-9 h-9 rounded-full bg-[#FFF0E8] border border-[#EC5B13]/20 flex items-center justify-center">
                <User size={17} className="text-[#EC5B13]" />
              </div>
            </button>
            {showUserMenu && (
              <>
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 py-1.5 z-50">
                  <button className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50">Profile Settings</button>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50">Logout</button>
                </div>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile nav drawer */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 flex flex-col gap-4">
          <Link href="/" className="text-sm font-bold text-gray-700">Home</Link>
          <Link href="/host/dashboard" className="text-sm font-bold text-[#EC5B13]">Dashboard</Link>
          <Link href="#" className="text-sm font-bold text-gray-700">Listings</Link>
          <Link href="#" className="text-sm font-bold text-gray-700">Help</Link>
        </div>
      )}

      {/* ── Page Content ── */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-10">

        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#1A1A24] tracking-tight">My Listings</h1>
            <p className="text-gray-500 font-medium mt-1">
              Welcome back, <span className="font-bold text-[#1A1A24] capitalize">{hostName}</span>. Manage all your properties here.
            </p>
          </div>
          <button
            onClick={() => router.push('/host/onboarding')}
            className="flex items-center gap-2 px-5 py-3 bg-[#EC5B13] text-white rounded-2xl font-bold text-sm hover:bg-[#d44f0f] transition-colors shadow-md self-start sm:self-auto"
          >
            <Plus size={16} /> Add New Property
          </button>
        </div>

        {/* Stats Row */}
        {properties.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<Home size={18} className="text-[#EC5B13]" />}       label="Total Listings"  value={counts.all}            color="bg-[#FFF0E8]" />
            <StatCard icon={<CheckCircle size={18} className="text-emerald-600" />} label="Published"    value={counts.published}       color="bg-emerald-50" />
            <StatCard icon={<Clock size={18} className="text-amber-600" />}       label="Under Review"   value={counts.pending_review}  color="bg-amber-50" />
            <StatCard icon={<FileText size={18} className="text-gray-500" />}     label="Drafts"         value={counts.draft}           color="bg-gray-100" />
          </div>
        )}

        {/* Filter Tabs */}
        {properties.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {TAB_CONFIG.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#1A1A24] text-white shadow'
                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
                  activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Grid or Empty State */}
        {properties.length === 0 ? (
          <EmptyState onAdd={() => router.push('/host/onboarding')} />
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 font-medium">
            No listings in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
            {/* Add more card */}
            <button
              onClick={() => router.push('/host/onboarding')}
              className="flex flex-col items-center justify-center gap-3 h-52 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-[#EC5B13] hover:text-[#EC5B13] hover:bg-[#FFF9F7] transition-all duration-200 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl border-2 border-current flex items-center justify-center">
                <Plus size={20} />
              </div>
              <span className="text-sm font-bold">Add Property</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
