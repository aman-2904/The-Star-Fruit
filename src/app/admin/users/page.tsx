"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Mail, Home, Clock, Search, ListFilter, RefreshCcw, MoreHorizontal } from "lucide-react";
import Image from "next/image";

interface Host {
  host_id: string;
  host_name: string;
  listing_count: number;
  last_active: string;
}

export default function AdminUserManagement() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHosts = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error("Supabase is not configured.");

      // Since we don't have a separate profiles table, we aggregate unique hosts from properties
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('host_id, host_name, created_at');

      if (fetchError) throw fetchError;

      // Group by host_id
      const hostMap = new Map<string, Host>();
      data?.forEach((p: any) => {
        if (!p.host_id) return;
        const existing = hostMap.get(p.host_id);
        if (existing) {
          existing.listing_count += 1;
          if (new Date(p.created_at) > new Date(existing.last_active)) {
             existing.last_active = p.created_at;
          }
        } else {
          hostMap.set(p.host_id, {
            host_id: p.host_id,
            host_name: p.host_name || 'Anonymous Host',
            listing_count: 1,
            last_active: p.created_at
          });
        }
      });

      setHosts(Array.from(hostMap.values()));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHosts();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Host Management</h2>
          <p className="text-gray-500 font-medium mt-1">Manage all property hosts and their activity.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search hosts..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/10 focus:border-[#EC5B13] transition-all"
            />
          </div>
          <button 
            onClick={fetchHosts}
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
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Host Detail</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Listing Count</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Last Listing</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="animate-pulse">
                   <td className="px-8 py-6"><div className="h-10 bg-gray-100 rounded-xl w-48" /></td>
                   <td className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-lg w-12" /></td>
                   <td className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-lg w-32" /></td>
                   <td className="px-8 py-6"><div className="h-10 bg-gray-100 rounded-xl w-10" /></td>
                </tr>
              ))
            ) : hosts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center">
                     <User size={48} className="text-gray-200 mb-4" />
                     <p className="font-bold text-gray-900">No hosts found</p>
                     <p className="text-sm text-gray-400 mt-1">Once hosts start listing properties, they will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              hosts.map((host) => (
                <tr key={host.host_id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFF0E8] flex items-center justify-center text-[#EC5B13] font-black text-xl">
                        {host.host_name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{host.host_name}</p>
                        <p className="text-xs text-gray-400 font-medium tracking-tight">ID: {host.host_id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Home size={16} className="text-[#EC5B13]" />
                      <span className="font-bold text-gray-700">{host.listing_count} Listings</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Clock size={16} className="text-gray-400" />
                       <span className="text-sm font-medium text-gray-600">
                         {new Date(host.last_active).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button className="p-3 bg-gray-50 text-gray-400 hover:text-[#EC5B13] hover:bg-[#FFF0E8]/50 rounded-2xl transition-all">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
