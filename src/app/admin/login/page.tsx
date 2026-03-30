"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

type AdminAuthView = 'login' | 'forgot_password' | 'verify_otp' | 'reset_password';

export default function AdminLoginPage() {
  const [view, setView] = useState<AdminAuthView>('login');
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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

      if (view === 'login') {
        const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;

        const user = data.user;
        if (user?.user_metadata?.role !== 'admin') {
          await supabase.auth.signOut();
          throw new Error("Unauthorized. This login is for administrators only.");
        }
        router.push("/admin/dashboard");
      } else if (view === 'forgot_password') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        alert("A 6-digit OTP has been sent to your email!");
        setView('verify_otp');
      } else if (view === 'verify_otp') {
        const { error } = await supabase.auth.verifyOtp({
          email,
          token: otp,
          type: 'recovery'
        });
        if (error) throw error;
        setView('reset_password');
        setPassword("");
      } else if (view === 'reset_password') {
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        alert("Password updated successfully!");
        setView('login');
        setPassword("");
        setConfirmPassword("");
        setOtp("");
      }
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
          <h2 className="text-3xl font-serif font-bold text-gray-900">
            {view === 'forgot_password' ? "Reset Admin Password"
             : view === 'verify_otp' ? "Enter OTP"
             : view === 'reset_password' ? "Set New Password"
             : "Admin Login"}
          </h2>
          <p className="text-gray-500 mt-2">
            {view === 'forgot_password' ? "Enter your email to receive a 6-digit OTP"
             : view === 'verify_otp' ? "Enter the 6-digit OTP sent to your email"
             : view === 'reset_password' ? "Create a new strong password"
             : "Manage The Star Fruit listings"}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {(view === 'login' || view === 'forgot_password') && (
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
          )}

          {view === 'verify_otp' && (
             <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">6-Digit OTP</label>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all text-center tracking-widest text-lg font-bold"
                required
              />
            </div>
          )}

          {(view === 'login' || view === 'reset_password') && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">
                 {view === 'reset_password' ? "New Password" : "Password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all pr-12"
                  required
                  minLength={view === 'reset_password' ? 6 : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {view === 'reset_password' && (
             <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/20 focus:border-[#EC5B13] transition-all pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          {view === 'login' && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setView('forgot_password')}
                className="text-sm text-[#EC5B13] font-bold hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

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
            {loading ? "Processing..."
             : view === 'forgot_password' ? "Send OTP"
             : view === 'verify_otp' ? "Verify OTP"
             : view === 'reset_password' ? "Update Password"
             : "Login to Dashboard"}
          </button>
        </form>

        <div className="mt-8 text-center">
          {(view === 'forgot_password' || view === 'verify_otp' || view === 'reset_password') ? (
            <button
              onClick={() => {
                setView('login');
                setError(null);
                setOtp("");
              }}
              className="text-[#EC5B13] font-bold hover:underline"
            >
              Back to Login
            </button>
          ) : (
            <Link href="/admin/signup" className="text-[#EC5B13] font-bold hover:underline">
              Don't have an admin account? Sign Up
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
