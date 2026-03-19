"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Home, 
  Clock, 
  CheckCircle, 
  FileText, 
  Users, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

interface Stats {
  totalListings: number;
  pendingReview: number;
  published: number;
  drafts: number;
  totalHosts: number;
}

export default function AdminDashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    totalListings: 0,
    pendingReview: 0,
    published: 0,
    drafts: 0,
    totalHosts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        if (!supabase) throw new Error("Supabase is not configured.");

        const { data, error: fetchError } = await supabase
          .from('properties')
          .select('status, host_id');

        if (fetchError) throw fetchError;

        if (data) {
          const hostIds = new Set(data.filter(p => p.host_id).map(p => p.host_id));
          setStats({
            totalListings: data.length,
            pendingReview: data.filter(p => p.status === 'pending_review').length,
            published: data.filter(p => p.status === 'published').length,
            drafts: data.filter(p => p.status === 'draft').length,
            totalHosts: hostIds.size
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-6">
        <div className={`w-14 h-14 rounded-3xl ${color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
          <Icon size={24} className="text-gray-900" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold">
            <ArrowUpRight size={14} />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{loading ? '...' : value}</h3>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-[32px] p-12 text-center">
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600 max-w-md mx-auto">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard Overview</h2>
        <p className="text-gray-500 font-medium mt-1">Real-time statistics and platform activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard 
          title="Total Listings" 
          value={stats.totalListings} 
          icon={Home} 
          color="bg-blue-50" 
          trend="+12%"
        />
        <StatCard 
          title="Pending Review" 
          value={stats.pendingReview} 
          icon={Clock} 
          color="bg-amber-50"
        />
        <StatCard 
          title="Published" 
          value={stats.published} 
          icon={CheckCircle} 
          color="bg-emerald-50" 
          trend="+5%"
        />
        <StatCard 
          title="Total Hosts" 
          value={stats.totalHosts} 
          icon={Users} 
          color="bg-purple-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity or Quick Actions can go here */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-gray-100 p-10 shadow-sm overflow-hidden relative">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#EC5B13]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
           <div className="relative z-10">
             <h3 className="text-2xl font-black text-gray-900 mb-2">Welcome Back, Admin</h3>
             <p className="text-gray-500 font-medium max-w-md leading-relaxed mb-8">
               You have <span className="text-[#EC5B13] font-black">{stats.pendingReview} properties</span> waiting for your review. Complete them to keep the platform growing!
             </p>
             <button 
               onClick={() => window.location.href = '/admin/listings'}
               className="px-8 py-4 bg-[#EC5B13] text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-[#d44f0f] transition-all shadow-lg shadow-[#EC5B13]/20"
             >
               Review Listings <ArrowUpRight size={20} />
             </button>
           </div>
        </div>

        <div className="bg-gray-900 rounded-[40px] p-10 text-white relative overflow-hidden group">
           <div className="absolute bottom-0 right-0 p-8 opacity-10 transition-transform group-hover:scale-110 duration-500">
              <ShieldCheck size={120} />
           </div>
           <h3 className="text-xl font-bold mb-6">Platform Health</h3>
           <div className="space-y-6">
              {[
                { label: 'Server Status', value: 'Optimal', color: 'bg-emerald-500' },
                { label: 'Database', value: 'Connected', color: 'bg-emerald-500' },
                { label: 'RLS Policies', value: 'Active', color: 'bg-[#EC5B13]' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-gray-400 font-bold text-sm tracking-wide">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black text-sm">{item.value}</span>
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
