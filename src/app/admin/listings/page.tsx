"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PropertyApproveCard from "@/components/admin/PropertyApproveCard";
import PropertyDetailsModal from "@/components/admin/PropertyDetailsModal";
import { ListFilter, RefreshCcw, Search, AlertCircle, CheckCircle, LayoutGrid, List } from "lucide-react";

export default function AdminListings() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'published' | 'rejected' | 'draft'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error("Supabase is not configured.");

      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setProperties(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      if (!supabase) return;
      const { error: updateError } = await supabase
        .from('properties')
        .update({ status: 'published' })
        .eq('id', id);

      if (updateError) throw updateError;
      setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'published' } : p));
    } catch (err: any) {
      alert("Error approving property: " + err.message);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this listing?")) return;
    try {
      if (!supabase) return;
      const { error: updateError } = await supabase
        .from('properties')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (updateError) throw updateError;
      setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
    } catch (err: any) {
      alert("Error rejecting property: " + err.message);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this publication? It will be moved back to 'Pending Review'.")) return;
    try {
      if (!supabase) return;
      const { error: updateError } = await supabase
        .from('properties')
        .update({ status: 'pending_review' })
        .eq('id', id);

      if (updateError) throw updateError;
      setProperties(prev => prev.map(p => p.id === id ? { ...p, status: 'pending_review' } : p));
    } catch (err: any) {
      alert("Error revoking property: " + err.message);
    }
  };

  const filteredProperties = properties.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'pending') return p.status === 'pending_review';
    return p.status === filter;
  });

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Property Listings</h2>
          <p className="text-gray-500 font-medium mt-1">Manage and review all property submissions.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search listings..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/10 focus:border-[#EC5B13] transition-all"
            />
          </div>
          <button 
            onClick={fetchProperties}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#EC5B13] hover:border-[#EC5B13]/30 transition-all shadow-sm"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <div className="flex bg-white border border-gray-100 rounded-2xl p-1 shadow-sm">
            {(['all', 'pending', 'published', 'rejected', 'draft'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${filter === f ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex bg-white border border-gray-100 rounded-2xl p-1 shadow-sm ml-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#EC5B13] text-white' : 'text-gray-400 hover:text-gray-600'}`}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#EC5B13] text-white' : 'text-gray-400 hover:text-gray-600'}`}
              title="List View"
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-[32px] h-[450px] animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-[32px] p-12 text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Properties</h3>
          <p className="text-red-600 max-w-md mx-auto">{error}</p>
          <button 
            onClick={fetchProperties}
            className="mt-6 px-8 py-3 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all"
          >
            Try Again
          </button>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-gray-100 p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutGrid size={40} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No listings found</h3>
          <p className="text-gray-500 font-medium max-w-sm mx-auto">
            {filter === 'all' 
              ? "There are no properties in the database yet." 
              : `There are no properties with status '${filter}' at the moment.`}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
          : "flex flex-col gap-4"
        }>
          {filteredProperties.map(property => (
            <PropertyApproveCard 
              key={property.id} 
              property={property} 
              onApprove={handleApprove}
              onReject={handleReject}
              onRevoke={handleRevoke}
              layout={viewMode}
              onClick={() => {
                setSelectedProperty(property);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {selectedProperty && (
        <PropertyDetailsModal 
          property={selectedProperty}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
