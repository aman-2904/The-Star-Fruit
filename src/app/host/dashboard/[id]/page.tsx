"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft, MapPin, Users, BedDouble, Bath, Wifi,
  UtensilsCrossed, Wind, Monitor, Tv2, Waves, BathIcon,
  Umbrella, ChefHat, Dumbbell, HeartPulse, Flame,
  BellElectric, BellRing, Clock, CheckCircle, FileText,
  ImageOff, Home, LayoutDashboard, Trash2, X, Eye, EyeOff, AlertTriangle,
  Phone, Mail
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { logActivity } from '@/lib/logger';

const AMENITY_MAP: Record<string, { label: string; icon: React.ReactNode }> = {
  wifi:          { label: 'WiFi',          icon: <Wifi size={15} /> },
  kitchen:       { label: 'Kitchen',       icon: <UtensilsCrossed size={15} /> },
  ac:            { label: 'AC',            icon: <Wind size={15} /> },
  workspace:     { label: 'Workspace',     icon: <Monitor size={15} /> },
  tv:            { label: 'TV',            icon: <Tv2 size={15} /> },
  private_pool:  { label: 'Private Pool',  icon: <Waves size={15} /> },
  hot_tub:       { label: 'Hot Tub',       icon: <BathIcon size={15} /> },
  beachfront:    { label: 'Beachfront',    icon: <Umbrella size={15} /> },
  private_chef:  { label: 'Private Chef',  icon: <ChefHat size={15} /> },
  private_gym:   { label: 'Private Gym',   icon: <Dumbbell size={15} /> },
  first_aid:     { label: 'First Aid Kit', icon: <HeartPulse size={15} /> },
  extinguisher:  { label: 'Extinguisher',  icon: <Flame size={15} /> },
  smoke_alarm:   { label: 'Smoke Alarm',   icon: <BellElectric size={15} /> },
};

const HOUSE_RULE_LABELS: Record<string, string> = {
  no_smoking: 'No Smoking',
  no_pets:    'No Pets',
  no_parties: 'No Parties',
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; text: string; dot: string; icon: React.ReactNode }> = {
    published:      { label: 'Published',    bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', icon: <CheckCircle size={13} /> },
    pending_review: { label: 'Under Review', bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500',   icon: <Clock size={13} /> },
    draft:          { label: 'Draft',        bg: 'bg-gray-100',    text: 'text-gray-500',    dot: 'bg-gray-400',    icon: <FileText size={13} /> },
  };
  const s = map[status] ?? map.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
      {s.icon} {s.label}
    </span>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
      <h2 className="text-lg font-black text-[#1A1A24] mb-0.5">{title}</h2>
      {subtitle && <p className="text-gray-400 text-sm font-medium mb-5">{subtitle}</p>}
      {!subtitle && <div className="mb-5" />}
      {children}
    </div>
  );
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!supabase || !id) { setLoading(false); return; }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth");
        return;
      }
      if (session.user.user_metadata?.role === 'user') {
        router.push("/");
        return;
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      if (error || !data) { setNotFound(true); }
      else { setProperty(data); }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!supabase || !deletePassword.trim()) return;
    setDeleteError('');
    setIsDeleting(true);
    try {
      // 1. Get the current user's email
      const { data: { session } } = await supabase.auth.getSession();
      const email = session?.user?.email;
      if (!email) {
        setDeleteError('Could not get user session. Please log in again.');
        setIsDeleting(false);
        return;
      }

      // 2. Re-authenticate with the entered password to verify identity
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password: deletePassword });
      if (authError) {
        console.error('[Delete] Auth failed:', authError);
        setDeleteError('Incorrect password. Please try again.');
        setIsDeleting(false);
        return;
      }

      // 3. Delete all images from Supabase Storage
      const imageUrls: string[] = property?.images || [];
      if (imageUrls.length > 0) {
        // Extract the storage path from each public URL
        // URL format: https://<project>.supabase.co/storage/v1/object/public/property-images/<path>
        const storagePaths = imageUrls
          .map(url => {
            try {
              const marker = '/property-images/';
              const idx = url.indexOf(marker);
              return idx !== -1 ? decodeURIComponent(url.slice(idx + marker.length)) : null;
            } catch { return null; }
          })
          .filter(Boolean) as string[];

        if (storagePaths.length > 0) {
          const { error: storageError } = await supabase.storage
            .from('property-images')
            .remove(storagePaths);
          if (storageError) {
            // Log but don't block deletion — the DB row is more important
            console.warn('[Delete] Storage cleanup warning:', storageError);
          }
        }
      }

      // 4. Delete the property row from DB
      const { error: delError } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (delError) {
        console.error('[Delete] Supabase delete error:', delError);
        // Surface a helpful message based on error code
        if (delError.code === '42501' || delError.message?.includes('policy')) {
          setDeleteError('Permission denied. Make sure you have a DELETE RLS policy on the properties table.');
        } else {
          setDeleteError(`Error: ${delError.message || 'Failed to delete. Please try again.'}`);
        }
        setIsDeleting(false);
        return;
      }

      await logActivity("Deleted a property listing", {
        property_id: id,
        title: property?.listing_title || property?.category || "Untitled Property"
      });

      // 4. Redirect to dashboard on success
      router.push('/host/dashboard');
    } catch (e: any) {
      console.error('[Delete] Unexpected error:', e);
      setDeleteError('Something went wrong. Please try again.');
      setIsDeleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
      <div className="w-10 h-10 rounded-full border-4 border-[#EC5B13] border-t-transparent animate-spin" />
    </div>
  );

  if (notFound || !property) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <p className="text-2xl font-black text-[#1A1A24]">Property not found</p>
      <Link href="/host/dashboard" className="text-[#EC5B13] font-bold text-sm hover:underline">← Back to Dashboard</Link>
    </div>
  );

  const photos: string[] = property.images || [];
  const amenities: string[] = property.amenities || [];
  const houseRules: Record<string, boolean> = property.house_rules || {};
  const customRules: string[] = property.custom_rules || [];
  const location = [property.street_address, property.city, property.state, property.pincode].filter(Boolean).join(', ');

  const activeRules = Object.entries(houseRules).filter(([, v]) => v).map(([k]) => HOUSE_RULE_LABELS[k] || k);

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200/60 px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-sm font-bold text-gray-500 hover:text-black flex items-center gap-1.5"><Home size={15} /> Home</Link>
          <Link href="/host/dashboard" className="text-sm font-bold text-[#EC5B13] flex items-center gap-1.5"><LayoutDashboard size={15} /> Dashboard</Link>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/host">
            <Image src="/images/logo.png" alt="The Star Fruit" width={140} height={35} className="h-8 w-auto" />
          </Link>
        </div>
        <div />
      </nav>

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-10 space-y-5">
        {/* Back + Header */}
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#1A1A24] transition-colors mb-5"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-[#1A1A24] tracking-tight line-clamp-1">
                {property.listing_title || property.category || 'Untitled Property'}
              </h1>
              {location && (
                <p className="flex items-center gap-1.5 text-gray-500 font-medium mt-1 text-sm">
                  <MapPin size={13} className="text-[#EC5B13]" /> {location}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={property.status} />
              <button
                onClick={() => { setShowDeleteModal(true); setDeleteError(''); setDeletePassword(''); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {/* Large cover photo */}
            <div className="col-span-2 relative aspect-video rounded-3xl overflow-hidden bg-gray-100">
              <Image src={photos[0]} alt="Cover Photo" fill className="object-cover" unoptimized />
              <div className="absolute top-3 left-3 bg-[#EC5B13] text-white text-[9px] font-black tracking-widest px-2 py-1 rounded-md uppercase">Cover Photo</div>
            </div>
            {/* Side photos */}
            <div className="flex flex-col gap-3">
              {photos.slice(1, 3).map((url, i) => {
                const isLast = i === 1 && photos.length > 3;
                return (
                  <div key={i} className="relative flex-1 rounded-2xl overflow-hidden bg-gray-100">
                    <Image src={url} alt={`Photo ${i + 2}`} fill className="object-cover" unoptimized />
                    {isLast && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">+{photos.length - 3} More</span>
                      </div>
                    )}
                  </div>
                );
              })}
              {photos.length === 1 && (
                <div className="flex-1 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <ImageOff size={20} className="text-gray-300" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Property Overview */}
        <Section title="Property Overview" subtitle="The core details of your stay.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[
              { label: 'Host Name',      value: property.host_name },
              { label: 'Host Bio',       value: property.host_description },
              { label: 'Property Type',  value: property.category },
              { label: 'Listing Title',  value: property.listing_title },
              { label: 'Host Phone',     value: property.host_phone },
              { label: 'Host Email',     value: property.host_email },
            ].map(({ label, value }) => value && (
              <div key={label}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-[#1A1A24] font-semibold text-sm leading-relaxed">{value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {property.listing_description && (
            <div className="border-t border-gray-50 pt-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description</p>
              <p className="text-[#374151] text-sm leading-relaxed">{property.listing_description}</p>
            </div>
          )}

          {/* Capacity Stats */}
          {(property.max_guests || property.bedrooms || property.beds || property.bathrooms) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-gray-50">
              {[
                { icon: <Users size={14} />,    value: property.max_guests,  label: 'Guests' },
                { icon: <BedDouble size={14} />, value: property.bedrooms,   label: 'Bedrooms' },
                { icon: <BedDouble size={14} />, value: property.beds,       label: 'Beds' },
                { icon: <Bath size={14} />,      value: property.bathrooms,  label: 'Bathrooms' },
              ].filter(s => s.value).map((stat, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#FFF8F5] rounded-xl px-3 py-2.5">
                  <span className="text-[#EC5B13]">{stat.icon}</span>
                  <span className="text-[#1A1A24] font-bold text-sm">{stat.value} {stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Location */}
        {location && (
          <Section title="Location" subtitle={[property.city, property.state].filter(Boolean).join(', ')}>
            <div className="flex items-start gap-2 text-sm font-medium text-[#1A1A24]">
              <MapPin size={14} className="text-[#EC5B13] mt-0.5 shrink-0" />
              <span>{location}</span>
            </div>
          </Section>
        )}

        {/* Amenities */}
        {amenities.length > 0 && (
          <Section title="Amenities & Features" subtitle="Every luxury convenience accounted for.">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
              {amenities.map(id => {
                const a = AMENITY_MAP[id];
                if (!a) return null;
                return (
                  <div key={id} className="flex items-center gap-2.5 text-sm font-semibold text-[#374151]">
                    <span className="text-[#EC5B13]">{a.icon}</span>
                    {a.label}
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* House Rules */}
        {(activeRules.length > 0 || customRules.length > 0) && (
          <Section title="House Rules">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeRules.map(rule => (
                <div key={rule} className="flex items-center gap-3 bg-[#F9F9F9] rounded-2xl px-4 py-3">
                  <BellRing size={15} className="text-[#EC5B13] shrink-0" />
                  <span className="text-sm font-semibold text-[#1A1A24]">{rule}</span>
                </div>
              ))}
              {customRules.map((rule, i) => (
                <div key={i} className="flex items-center gap-3 bg-[#F9F9F9] rounded-2xl px-4 py-3">
                  <BellRing size={15} className="text-[#EC5B13] shrink-0" />
                  <span className="text-sm font-semibold text-[#1A1A24]">{rule}</span>
                </div>
              ))}
            </div>
          </Section>
        )}
      </main>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <AlertTriangle size={16} /> Delete Property
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="text-xl font-black text-[#1A1A24] text-center mb-1">Are you sure?</h3>
              <p className="text-gray-500 text-sm text-center mb-6 leading-relaxed">
                This will permanently delete <span className="font-bold text-[#1A1A24]">{property.listing_title || property.category || 'this property'}</span> and all its data. This action cannot be undone.
              </p>

              {/* Password Field */}
              <label className="block text-sm font-bold text-[#1A1A24] mb-2">Enter your password to confirm</label>
              <div className="relative mb-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={e => { setDeletePassword(e.target.value); setDeleteError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleDelete()}
                  placeholder="Your account password"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 pr-12 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {deleteError && (
                <p className="text-red-500 text-xs font-semibold mb-4 flex items-center gap-1">
                  <AlertTriangle size={12} /> {deleteError}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={!deletePassword.trim() || isDeleting}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <><span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" /> Deleting...</>
                  ) : (
                    <><Trash2 size={14} /> Delete Forever</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
