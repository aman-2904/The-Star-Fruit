"use client";

import React, { useEffect, useState } from "react";
import { Sliders, CheckCircle, AlertTriangle, Copy, Check, Loader2 } from "lucide-react";
import { clearSettingsCache } from "@/lib/tracking-settings";
import { supabase } from "@/lib/supabase";

export default function AdminSettings() {
  const [pixelEnabled, setPixelEnabled] = useState(true);
  const [capiEnabled, setCapiEnabled] = useState(true);
  const [tableExists, setTableExists] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setPixelEnabled(data.pixel_enabled);
      setCapiEnabled(data.capi_enabled);
      setTableExists(data.table_exists);
      if (data.error && !data.table_exists) {
        console.warn("Table platform_settings is missing:", data.error);
      }
    } catch (err: unknown) {
      setError("Failed to load settings from API: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (newPixel: boolean, newCapi: boolean) => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      let headers: Record<string, string> = { "Content-Type": "application/json" };
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers["Authorization"] = `Bearer ${session.access_token}`;
        }
      }

      const res = await fetch("/api/settings", {
        method: "POST",
        headers,
        body: JSON.stringify({
          pixel_enabled: newPixel,
          capi_enabled: newCapi
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings");

      setPixelEnabled(newPixel);
      setCapiEnabled(newCapi);
      clearSettingsCache(); // Clear client-side settings cache
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  const sqlCode = `CREATE TABLE IF NOT EXISTS platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for checking status)
CREATE POLICY "Allow public read access" ON platform_settings FOR SELECT USING (true);

-- Allow authenticated admin write access
CREATE POLICY "Allow admin write access" ON platform_settings FOR ALL USING (
  auth.role() = 'authenticated' AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- Insert default tracking configuration
INSERT INTO platform_settings (key, value)
VALUES ('facebook_tracking', '{"pixel_enabled": true, "capi_enabled": true}')
ON CONFLICT (key) DO NOTHING;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[1000px] mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tracking Settings</h2>
        <p className="text-gray-500 font-medium mt-1">Configure Meta Pixel (client-side) and Conversion API (server-side) events.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-[40px] border border-gray-100 p-16 text-center shadow-sm flex items-center justify-center min-h-[300px]">
          <Loader2 size={32} className="animate-spin text-[#EC5B13]" />
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Main Controls Card */}
          <div className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#EC5B13]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF0E8] flex items-center justify-center">
                <Sliders size={22} className="text-[#EC5B13]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Facebook Tracking Status</h3>
                <p className="text-sm text-gray-400 font-medium">Toggle individual Meta marketing integrations.</p>
              </div>
            </div>

            <div className="space-y-8 border-t border-gray-50 pt-8">
              {/* Meta Pixel Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="max-w-md">
                  <h4 className="font-bold text-gray-900 text-[16px]">Meta Pixel (Client-side)</h4>
                  <p className="text-sm text-gray-400 font-medium mt-0.5">
                    Fires browser PageView and custom user events directly from the guest&apos;s device. Recommended for ad optimization.
                  </p>
                </div>
                <button
                  disabled={saving || !tableExists}
                  onClick={() => handleSave(!pixelEnabled, capiEnabled)}
                  className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                    pixelEnabled ? "bg-[#00BA74]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      pixelEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Conversion API Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-50 pt-8">
                <div className="max-w-md">
                  <h4 className="font-bold text-gray-900 text-[16px]">Conversion API (Server-side)</h4>
                  <p className="text-sm text-gray-400 font-medium mt-0.5">
                    Forwards booking inquiries and user registration leads securely from the backend server to Facebook Graph API. Helps circumvent ad-blockers.
                  </p>
                </div>
                <button
                  disabled={saving || !tableExists}
                  onClick={() => handleSave(pixelEnabled, !capiEnabled)}
                  className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                    capiEnabled ? "bg-[#00BA74]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      capiEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Notification Bar */}
            {saveSuccess && (
              <div className="mt-8 flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 animate-in fade-in zoom-in duration-200">
                <CheckCircle size={18} />
                <span className="text-sm font-bold">Settings saved successfully and client caches updated!</span>
              </div>
            )}

            {error && (
              <div className="mt-8 flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-2xl p-4 animate-in fade-in zoom-in duration-200">
                <AlertTriangle size={18} />
                <span className="text-sm font-bold">{error}</span>
              </div>
            )}
          </div>

          {/* Database Missing Warning */}
          {!tableExists && (
            <div className="bg-[#FFF8F5] border border-[#FFECE5] rounded-[40px] p-8 md:p-10 shadow-sm relative overflow-hidden">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#FFF0E8] flex items-center justify-center shrink-0">
                  <AlertTriangle size={22} className="text-[#EC5B13]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Database Table Missing</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1 leading-relaxed">
                    The required table <code className="bg-[#FFF0E8] px-2 py-0.5 rounded text-[#EC5B13] font-bold text-xs">platform_settings</code> does not exist in your Supabase database. 
                    Tracking will remain <strong>enabled by default</strong>. 
                    Please execute the following SQL migration script in your Supabase SQL Editor to initialize configuration storage:
                  </p>
                </div>
              </div>

              <div className="relative mt-4">
                <pre className="bg-gray-900 text-gray-300 p-6 rounded-3xl text-xs overflow-x-auto font-mono leading-relaxed border border-gray-800 shadow-inner max-h-[350px] scrollbar-thin">
                  {sqlCode}
                </pre>
                <button
                  onClick={copyToClipboard}
                  className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-2 backdrop-blur-md active:scale-95 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-400" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> Copy SQL
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
