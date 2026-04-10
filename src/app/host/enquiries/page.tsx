"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, Phone, Clock, Search, RefreshCcw, User, X, Calendar, Home, CheckCircle2, AlertCircle, Lock, Unlock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PropertyEnquiry {
  id: string;
  property_id: string;
  full_name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  purpose: string;
  is_paid: boolean;
  status: string;
  created_at: string;
  properties?: {
    listing_title: string;
  };
}

export default function HostPropertyEnquiries() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<PropertyEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<PropertyEnquiry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hostName, setHostName] = useState('Host');

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error("Supabase is not configured.");

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/auth'); return; }
      
      const user = session.user;
      setHostName(user.user_metadata?.full_name || 'Host');

      // Fetch enquiries for properties owned by this host
      const { data, error: fetchError } = await supabase
        .from('property_enquiries')
        .select('*, properties!inner(listing_title, host_id)')
        .eq('properties.host_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setEnquiries(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name[0]}***@${domain}`;
  };

  const maskPhone = (phone: string) => {
    return `${phone.slice(0, 3)}*******`;
  };

  const filteredEnquiries = enquiries.filter(enq => {
    const searchString = `${enq.full_name} ${enq.properties?.listing_title || ""}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#F7F7F8] font-sans">
      {/* Navbar Link back */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200/60 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/host/dashboard" className="text-sm font-bold text-gray-500 hover:text-black flex items-center gap-1.5 transition-colors">
            <RefreshCcw size={15} /> Back to Dashboard
          </Link>
          <Image src="/images/logo.png" alt="The Star Fruit" width={140} height={35} className="h-8 w-auto" />
          <div className="w-10 h-10 rounded-full bg-[#FFF0E8] border border-[#EC5B13]/20 flex items-center justify-center">
            <User size={17} className="text-[#EC5B13]" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-[#1A1A24] tracking-tight">Stay Enquiries</h1>
            <p className="text-gray-500 font-medium mt-1">Manage all booking requests for your properties.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 lg:w-64">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by name or property..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/10 focus:border-[#EC5B13] transition-all"
              />
            </div>
            <button 
              onClick={fetchEnquiries}
              className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-400 hover:text-[#EC5B13] transition-all shadow-sm"
            >
              <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 font-bold text-[11px] text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-6">Guest Info</th>
                <th className="px-8 py-6">Property</th>
                <th className="px-8 py-6">Stay Duration</th>
                <th className="px-8 py-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6"><div className="h-10 bg-gray-100 rounded-lg w-40" /></td>
                    <td className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-lg w-48" /></td>
                    <td className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-lg w-32" /></td>
                    <td className="px-8 py-6"><div className="h-8 bg-gray-100 rounded-xl w-24" /></td>
                  </tr>
                ))
              ) : filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-medium">
                    No enquiries found for your properties yet.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enquiry) => (
                  <tr 
                    key={enquiry.id} 
                    className="hover:bg-gray-50/50 transition-all group cursor-pointer"
                    onClick={() => { setSelectedEnquiry(enquiry); setIsModalOpen(true); }}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#1A1A24] flex items-center justify-center text-white font-bold">
                          {enquiry.full_name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-black text-[#1A1A24]">{enquiry.full_name}</p>
                          <p className="text-xs text-gray-400 font-bold">{enquiry.is_paid ? enquiry.email : maskEmail(enquiry.email)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-bold text-[#1A1A24]">
                      {enquiry.properties?.listing_title}
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-bold text-gray-600">
                        {new Date(enquiry.check_in).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(enquiry.check_out).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-[10px] font-black text-gray-400 uppercase mt-0.5">{enquiry.guests} Guests</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        enquiry.is_paid 
                          ? "bg-emerald-50 text-emerald-600" 
                          : "bg-amber-50 text-amber-600"
                      }`}>
                        {enquiry.is_paid ? <Unlock size={10} /> : <Lock size={10} />}
                        {enquiry.is_paid ? "Details Unlocked" : "Awaiting Paid"}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Detail Modal */}
      {isModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#1A1A24] text-white flex items-center justify-center font-black text-2xl">
                  {selectedEnquiry.full_name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#1A1A24]">{selectedEnquiry.full_name}</h3>
                  <p className="text-xs text-gray-500 font-bold">Inquiry for {selectedEnquiry.properties?.listing_title}</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Contact Info Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">Guest Contact Details</h4>
                   {!selectedEnquiry.is_paid && (
                     <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 uppercase">
                       <Lock size={10} /> Locked until payment
                     </span>
                   )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-2xl border ${selectedEnquiry.is_paid ? 'bg-white border-emerald-100' : 'bg-gray-50/50 border-gray-100 opacity-60'}`}>
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1.5">
                       <Mail size={12} /> Email Address
                    </p>
                    <p className="text-sm font-bold text-[#1A1A24]">
                      {selectedEnquiry.is_paid ? selectedEnquiry.email : maskEmail(selectedEnquiry.email)}
                    </p>
                  </div>
                  <div className={`p-4 rounded-2xl border ${selectedEnquiry.is_paid ? 'bg-white border-emerald-100' : 'bg-gray-50/50 border-gray-100 opacity-60'}`}>
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1 flex items-center gap-1.5">
                       <Phone size={12} /> Phone Number
                    </p>
                    <p className="text-sm font-bold text-[#1A1A24]">
                      {selectedEnquiry.is_paid ? selectedEnquiry.phone : maskPhone(selectedEnquiry.phone)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stay Details */}
              <div className="bg-gray-50 rounded-[32px] p-6 border border-gray-100">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <Calendar size={14} className="text-[#EC5B13]" />
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrival</span>
                    </div>
                    <p className="text-lg font-black text-[#1A1A24]">{new Date(selectedEnquiry.check_in).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <Calendar size={14} className="text-[#EC5B13]" />
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Departure</span>
                    </div>
                    <p className="text-lg font-black text-[#1A1A24]">{new Date(selectedEnquiry.check_out).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Guests</p>
                    <p className="text-sm font-bold text-gray-700">{selectedEnquiry.guests} People</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Purpose of Stay</p>
                    <p className="text-sm font-bold text-gray-700">{selectedEnquiry.purpose || "Vacation/Other"}</p>
                  </div>
                </div>
              </div>

              {!selectedEnquiry.is_paid && (
                <div className="bg-amber-50 rounded-2xl p-4 flex items-start gap-3 border border-amber-100">
                  <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-amber-700 leading-relaxed">
                    Contact details are hidden to protect privacy before payment. They will be automatically revealed once the Admin confirms your payment receipt.
                  </p>
                </div>
              )}

              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full py-4 bg-[#1A1A24] text-white rounded-2xl font-black text-base shadow-lg hover:bg-black transition-all active:scale-[0.98]"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
