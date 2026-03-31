"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Clock, RefreshCcw, Activity, Info } from "lucide-react";

interface ActivityLog {
  id: string;
  user_id: string;
  user_role: string;
  action: string;
  details: Record<string, any>;
  created_at: string;
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getActionStyle = (action: string) => {
    const act = action.toLowerCase();
    if (act.includes('deleted') || act.includes('rejected')) {
      return 'text-red-700 bg-red-50 border-red-100';
    }
    if (act.includes('submitted') || act.includes('approved')) {
      return 'text-emerald-700 bg-emerald-50 border-emerald-100';
    }
    if (act.includes('revoked')) {
      return 'text-amber-700 bg-amber-50 border-amber-100';
    }
    return 'text-gray-700 bg-gray-50 border-gray-100';
  };

  const fetchLogs = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (!supabase) throw new Error("Supabase not configured");

      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        if (error.message.includes("Could not find the table")) {
          setErrorMsg("The activity_logs table has not been created in Supabase yet. Please run the provided SQL script.");
        } else {
          throw error;
        }
      } else {
        setLogs(data || []);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Activity Logs</h2>
          <p className="text-gray-500 font-medium mt-1">Monitor recent actions performed by admins and hosts.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchLogs}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#EC5B13] hover:border-[#EC5B13]/30 transition-all shadow-sm flex items-center justify-center shrink-0"
            title="Refresh logs"
          >
            <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-1/4">User & Role</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] w-1/3">Action</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Context / Details</th>
              <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              [1, 2, 3].map(i => (
                 <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6"><div className="h-10 bg-gray-100 rounded-xl w-32" /></td>
                    <td className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-lg w-40" /></td>
                    <td className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-lg w-32" /></td>
                    <td className="px-8 py-6"><div className="h-6 bg-gray-100 rounded-lg w-24 ml-auto" /></td>
                 </tr>
              ))
            ) : errorMsg ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center">
                     <Info size={48} className="text-red-400 mb-4" />
                     <p className="font-bold text-gray-900">Missing Database Setup</p>
                     <p className="text-sm text-gray-500 mt-1 max-w-md">{errorMsg}</p>
                     <p className="text-xs text-gray-400 mt-4 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 inline-block">Check the Walkthrough document for the SQL script to run in your Supabase SQL Editor.</p>
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center">
                     <Activity size={48} className="text-gray-200 mb-4" />
                     <p className="font-bold text-gray-900">No activity logs recorded yet</p>
                     <p className="text-sm text-gray-400 mt-1">Actions performed by staff will appear here.</p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${log.user_role === 'admin' ? 'bg-[#FFF0E8] text-[#EC5B13]' : 'bg-gray-100 text-gray-600'}`}>
                        {log.user_role[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 capitalize">{log.user_role}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5 break-all" title={log.details?.email || log.user_id}>
                          {log.details?.email || log.user_id.slice(0, 8) + '...'}
                        </p>
                        {log.details?.phone && (
                          <p className="text-[10px] text-gray-400 font-bold tracking-wider mt-0.5 break-all">
                            {log.details.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border ${getActionStyle(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      {log.details && Object.entries(log.details).filter(([k]) => k !== 'email' && k !== 'phone').map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-xs">
                          <span className="text-gray-400 font-bold uppercase tracking-wider">{key}:</span>
                          <span className="text-gray-600 font-medium truncate max-w-[200px]" title={String(value)}>{String(value)}</span>
                        </div>
                      ))}
                      {(!log.details || Object.keys(log.details).filter(k => k !== 'email' && k !== 'phone').length === 0) && (
                        <span className="text-xs text-gray-400 italic">No extra details</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-xs font-medium text-gray-500">
                       <Clock size={14} className="text-gray-400" />
                       {new Date(log.created_at).toLocaleString(undefined, {
                         month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                       })}
                    </div>
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
