"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        throw new Error("Supabase is not configured.");
      }

      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (loginError) throw loginError;

      const user = data.user;
      if (user?.user_metadata?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error("Unauthorized. This login is for administrators only.");
      }

      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-[32px] p-8 md:p-12 shadow-xl border border-gray-100">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-8">
            <Image src="/images/black.png" alt="Logo" width={180} height={45} className="h-10 w-auto" />
          </Link>
          <h2 className="text-3xl font-serif font-bold text-gray-900">Admin Login</h2>
          <p className="text-gray-500 mt-2">Manage The Star Fruit listings</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Admin Email</label>
            <input
              type="email"
              placeholder="admin@stafruit.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#EC5B13] text-white rounded-2xl font-bold text-lg shadow-lg shadow-[#EC5B13]/20 hover:bg-[#d44f0f] active:scale-[0.98] transition-all disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/admin/signup" className="text-[#EC5B13] font-bold hover:underline">
            Don't have an admin account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
