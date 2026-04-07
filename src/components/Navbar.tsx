"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe, User, Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userFullName, setUserFullName] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      if (!supabase) return;
      const { data: { session: curSession } } = await supabase.auth.getSession();
      setSession(curSession);
      if (curSession?.user) {
        setUserFullName(curSession.user.user_metadata?.full_name || curSession.user.email?.split('@')[0] || "User");
      }
    }
    checkSession();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, curSession) => {
        setSession(curSession);
        if (curSession?.user) {
          setUserFullName(curSession.user.user_metadata?.full_name || curSession.user.email?.split('@')[0] || "User");
        }
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setShowUserMenu(false);
      router.refresh();
    }
  };

  return (
    <>
      <nav className="flex items-center justify-between px-4 md:px-10 py-3 md:py-3 bg-white sticky top-0 z-50">
        {/* Left: Menu Items (Desktop) */}
        <div className="hidden lg:flex items-center space-x-12">
          <Link href="#" className="font-semibold text-[15px] text-gray-800 hover:text-black transition-colors">Villas</Link>
          <Link href="#" className="font-semibold text-[15px] text-gray-800 hover:text-black transition-colors">Stays</Link>
          <Link href="#" className="font-semibold text-[15px] text-gray-800 hover:text-black transition-colors">Cruise</Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            className="p-2 text-gray-800"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/">
            <Image
              src="/images/black.png"
              alt="LuxeVillaz Logo"
              width={160}
              height={40}
              className="h-8 md:h-10 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2 md:space-x-8">
          {(!session || session.user.user_metadata?.role !== 'user') && (
            <Link 
              href={session?.user?.user_metadata?.role === 'host' ? "/host" : "/auth"} 
              className="hidden sm:block text-[15px] font-bold text-gray-800 hover:text-black transition-colors"
            >
              {session?.user?.user_metadata?.role === 'host' ? "Host Dashboard" : "Become a host"}
            </Link>
          )}
          <button className="flex items-center space-x-1 md:space-x-2 text-[15px] font-bold text-gray-800 hover:text-black transition-colors">
            <Globe size={20} strokeWidth={2.5} className="w-[18px] h-[18px] md:w-5 md:h-5" />
            <span className="hidden md:inline">English</span>
          </button>
          
          <div className="relative">
            {session ? (
              <div 
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="p-1.5 md:p-2.5 border border-gray-200 rounded-full bg-gray-50 group-hover:shadow-md transition-shadow">
                  <User size={22} strokeWidth={2.5} className="w-[18px] h-[18px] md:w-6 md:h-6 text-gray-800" />
                </div>
              </div>
            ) : (
              <Link href="/login" className="block">
                <div className="p-1.5 md:p-2.5 border border-gray-200 rounded-full hover:shadow-md transition-shadow bg-gray-50 group-hover:bg-gray-100">
                  <User size={22} strokeWidth={2.5} className="w-[18px] h-[18px] md:w-6 md:h-6 text-gray-800" />
                </div>
              </Link>
            )}

            {/* User Dropdown */}
            {session && showUserMenu && (
              <>
                <div className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-5 py-3 border-b border-gray-50 mb-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black">Account</p>
                    <p className="text-sm font-bold text-gray-900 truncate capitalize">{userFullName}</p>
                  </div>
                  <Link 
                    href="/profile" 
                    onClick={() => setShowUserMenu(false)}
                    className="block w-full text-left px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    My Profile
                  </Link>
                  <button className="w-full text-left px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                    My Bookings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-5 py-2.5 text-sm font-bold text-black hover:bg-gray-50 transition-colors mt-2 border-t border-gray-50 pt-3"
                  >
                    Log Out
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

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden fixed left-0 right-0 top-[60px] md:top-[68px] bg-white border-b border-gray-100 px-6 py-4 shadow-sm z-40 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-4">
            <Link href="#" className="text-base font-bold text-gray-800 hover:text-black">Villas</Link>
            <Link href="#" className="text-base font-bold text-gray-800 hover:text-black">Stays</Link>
            <Link href="#" className="text-base font-bold text-gray-800 hover:text-black">Cruise</Link>
            <div className="border-t border-gray-100 pt-4 mt-2">
              {(!session || session.user.user_metadata?.role !== 'user') && (
                <Link 
                  href={session?.user?.user_metadata?.role === 'host' ? "/host" : "/auth"} 
                  className="text-base font-bold text-[#EC5B13] hover:text-[#D14F10]"
                >
                  {session?.user?.user_metadata?.role === 'host' ? "Host Dashboard" : "Become a host"}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
