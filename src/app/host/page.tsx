"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function HostDashboard() {
  const [loading, setLoading] = useState(true);
  const [hostName, setHostName] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/auth");
      } else {
        const user = session.user;
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || "Host";
        setHostName(name);
        setLoading(false);
      }
    }
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5A5F]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Host Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-20 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-12">
          <Link href="/" className="text-sm font-bold text-gray-800 hover:text-black">Home</Link>
          <Link href="#" className="text-sm font-bold text-gray-800 hover:text-black">Dashboard</Link>
          <Link href="#" className="text-sm font-bold text-gray-800 hover:text-black">Listings</Link>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Image src="/images/logo.png" alt="LuxeVilla" width={140} height={35} className="h-8 w-auto" />
        </div>

        <div className="flex items-center space-x-8">
          <Link href="#" className="hidden md:block text-sm font-bold text-gray-800 hover:text-black">Help</Link>
          <button className="hidden sm:flex items-center space-x-2 text-sm font-bold text-gray-800">
            <Globe size={18} />
            <span>English</span>
          </button>

          <div className="relative">
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <p className="text-sm font-bold text-gray-900 hidden sm:block">Welcome, <span className="capitalize">{hostName}</span></p>
              <button className="p-2 border border-gray-200 rounded-full bg-gray-50 group-hover:shadow-md transition-shadow">
                <User size={20} className="text-gray-600" />
              </button>
            </div>

            {/* User Dropdown */}
            {showUserMenu && (
              <>
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1 sm:hidden">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black">Account</p>
                    <p className="text-sm font-bold text-gray-900 truncate capitalize">{hostName}</p>
                  </div>
                  <button className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                    List Your Property
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#FF5A5F] hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
                {/* Click outside to close */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="p-4 md:p-8">
        <div className="max-w-[1400px] mx-auto relative rounded-[40px] overflow-hidden min-h-[600px] flex items-center justify-center text-center">
          <Image
            src="/images/contactus.jpg"
            alt="Host Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />

          <div className="relative z-10 px-6 mt-12">
            <span className="inline-block px-4 py-1.5 bg-[#EC5B13]/20 text-[#EC5B13] text-[10px] font-black tracking-[0.2em] rounded-full mb-8 backdrop-blur-md border border-[#EC5B13]/30 uppercase">
              Exclusive Hosting
            </span>
            <h1 className="text-5xl md:text-[90px] font-black text-white leading-[0.95] mb-8 tracking-tight">
              Host your slice<br />of Goa
            </h1>
            <p className="text-white/90 text-sm md:text-lg max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Reach global travelers, secure premium bookings, and manage your luxury property with ease on Goa's most exclusive hospitality platform.
            </p>

            <button className="px-10 py-5 bg-[#EC5B13B2] text-white rounded-2xl font-black text-lg shadow-2xl shadow-black/20 hover:bg-[#EC5B13B2] transition-all hover:scale-105 active:scale-95">
              Get Started Now
            </button>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-12 max-w-4xl mx-auto">
              <div className="text-white">
                <p className="text-3xl md:text-4xl font-black">500+</p>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 mt-1">Active Hosts</p>
              </div>
              <div className="text-white">
                <p className="text-3xl md:text-4xl font-black">₹2.4Cr</p>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 mt-1">Paid Out</p>
              </div>
              <div className="text-white">
                <p className="text-3xl md:text-4xl font-black">4.9/5</p>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-60 mt-1">Host Rating</p>
              </div>
            </div>
          </div>

          {/* High Demand Area Card */}
          <div className="absolute left-12 top-1/2 -translate-y-1/2 hidden lg:block">
            <div className="w-[300px] bg-white/10 backdrop-blur-2xl p-8 rounded-[32px] border border-white/20 shadow-2xl text-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">Live Now</span>
                  <span className="text-sm font-bold text-white tracking-tight">High Demand Area</span>
                </div>
              </div>
              <p className="text-white/80 text-sm italic font-medium leading-relaxed">
                "Properties in <span className="text-white font-bold">North Goa</span> are seeing a <span className="text-white font-bold">40% increase</span> in luxury bookings this month."
              </p>
              <div className="h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-white/40 w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
