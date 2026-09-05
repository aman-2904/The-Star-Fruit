"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Mail, Shield, Clock, Search, RefreshCcw } from "lucide-react";

interface ManagementUser {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  display_name?: string;
}

export default function AdminManagementUsers() {
  const [users, setUsers] = useState<ManagementUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!supabase) throw new Error("Supabase is not configured.");

      const { data, error: fetchError } = await supabase.rpc('get_management_users');

      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      
      // Optimistically update the UI
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: newStatus } : u));
      
      const { error } = await supabase
        .from('user_status')
        .upsert({ user_id: userId, is_active: newStatus });
        
      if (error) throw error;
    } catch (err: any) {
      console.error("Error toggling user status:", err);
      alert("Failed to update user status: " + err.message);
      // Revert on error
      fetchUsers();
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Management Users</h2>
          <p className="text-gray-500 font-medium mt-1">Manage admin and blog user access across Luxevillaz.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/10 focus:border-[#EC5B13] transition-all"
            />
          </div>
          <button 
            onClick={fetchUsers}
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
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">User Detail</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email Address</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Role</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Joined</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [1, 2, 3].map(i => (
                 <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6"><div className="h-10 bg-gray-100 rounded-xl w-48" /></td>
                    <td className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-lg w-40" /></td>
                    <td className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-lg w-20" /></td>
                    <td className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-lg w-24" /></td>
                    <td className="px-8 py-6"><div className="h-8 bg-gray-100 rounded-xl w-14" /></td>
                 </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-red-500 font-bold">
                  {error}
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center">
                     <Shield size={48} className="text-gray-200 mb-4" />
                     <p className="font-bold text-gray-900">No management users found</p>
                     <p className="text-sm text-gray-400 mt-1">Users with admin or blog roles will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFF0E8] flex items-center justify-center text-[#EC5B13] font-black text-xl">
                        {(user.display_name || user.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user.display_name || 'Management User'}</p>
                        <p className="text-xs text-gray-400 font-medium tracking-tight">ID: {user.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Mail size={14} className="text-gray-400" />
                       <span className="text-xs font-bold text-[#EC5B13] lowercase">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                       <Clock size={16} className="text-gray-400" />
                       <span className="text-sm font-medium text-gray-600">
                         {new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${user.is_active ? 'bg-[#EC5B13]' : 'bg-gray-200'}`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${user.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                    <span className="ml-3 text-xs font-bold text-gray-500">
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
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
