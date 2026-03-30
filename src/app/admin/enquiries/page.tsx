"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, Phone, Clock, Search, RefreshCcw, MoreHorizontal, User, MessageSquare, X, Calendar, Trash2 } from "lucide-react";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEnquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error("Supabase is not configured.");

      const { data, error: fetchError } = await supabase
        .from('contacts')
        .select('*')
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

  const openEnquiry = (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this enquiry?")) return;

    try {
      if (!supabase) throw new Error("Supabase is not configured.");

      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setEnquiries(enquiries.filter(enq => enq.id !== id));
      alert("Enquiry deleted successfully.");
    } catch (err: any) {
      alert("Error deleting enquiry: " + err.message);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Enquiries & Messages</h2>
          <p className="text-gray-500 font-medium mt-1">View and manage all contact form submissions.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search enquiries..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/10 focus:border-[#EC5B13] transition-all"
            />
          </div>
          <button 
            onClick={fetchEnquiries}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#EC5B13] hover:border-[#EC5B13]/30 transition-all shadow-sm"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Contact Detail</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Subject</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Received On</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [1, 2, 3].map(i => (
                 <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6"><div className="h-10 bg-gray-100 rounded-xl w-48" /></td>
                    <td className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-lg w-40" /></td>
                    <td className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-lg w-32" /></td>
                    <td className="px-8 py-6"><div className="h-10 bg-gray-100 rounded-xl w-10" /></td>
                 </tr>
              ))
            ) : enquiries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center">
                     <MessageSquare size={48} className="text-gray-200 mb-4" />
                     <p className="font-bold text-gray-900">No enquiries yet</p>
                     <p className="text-sm text-gray-400 mt-1">When someone fills the contact form, it will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-gray-50/50 transition-all group cursor-pointer" onClick={() => openEnquiry(enquiry)}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFF0E8] flex items-center justify-center text-[#EC5B13] font-black text-xl">
                        {enquiry.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{enquiry.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] flex items-center gap-1 text-gray-400 font-bold uppercase tracking-wider">
                            <Mail size={10} /> {enquiry.email}
                          </span>
                          {enquiry.phone && (
                            <span className="text-[10px] flex items-center gap-1 text-gray-400 font-bold uppercase tracking-wider">
                              <Phone size={10} /> {enquiry.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-gray-700 line-clamp-1">{enquiry.subject || "No Subject"}</p>
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{enquiry.message}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Clock size={16} className="text-gray-400" />
                       <span className="text-sm font-medium text-gray-600">
                         {new Date(enquiry.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); openEnquiry(enquiry); }}
                        className="px-4 py-2 bg-gray-50 text-gray-600 hover:text-[#EC5B13] hover:bg-[#FFF0E8]/50 rounded-xl font-bold text-xs transition-all border border-gray-100"
                      >
                        View
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, enquiry.id)}
                        className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-gray-100"
                        title="Delete Enquiry"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enquiry Modal */}
      {isModalOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#EC5B13] font-black text-2xl border border-gray-100">
                  {selectedEnquiry.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900">{selectedEnquiry.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-bold text-[#EC5B13]">{selectedEnquiry.email}</span>
                    {selectedEnquiry.phone && <span className="text-xs font-bold text-gray-400">• {selectedEnquiry.phone}</span>}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-200/50 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={16} className="text-[#EC5B13]" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inquiry Details</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  <h4 className="text-sm font-black text-gray-900 mb-1">Subject</h4>
                  <p className="text-gray-600 font-medium mb-6">{selectedEnquiry.subject || "No subject provided"}</p>
                  
                  <h4 className="text-sm font-black text-gray-900 mb-1">Message</h4>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedEnquiry.message}</p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-[11px] font-bold text-gray-400">
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  Received on {new Date(selectedEnquiry.created_at).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                   Contact ID: {selectedEnquiry.id}
                </div>
              </div>
            </div>

            <div className="p-8 pt-0">
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="w-full py-4 bg-[#EC5B13] text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#EC5B13]/20 hover:bg-[#d44f0f] active:scale-[0.98] transition-all"
               >
                 Close Message
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
