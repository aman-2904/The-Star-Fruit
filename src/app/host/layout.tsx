"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, LogOut, Menu, X, Home, MessageSquare, Plus, User } from "lucide-react";

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hostName, setHostName] = useState("Host");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push("/auth");
        setLoading(false);
        return;
      }

      const user = session.user;
      const role = user?.user_metadata?.role;
      
      // Allow if admin or host
      if (role !== 'host' && role !== 'admin') {
        router.push("/");
        return;
      }

      setHostName(user.user_metadata?.full_name || user.email?.split('@')[0] || "Host");
      setLoading(false);
    }

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      router.push("/");
    }
  };

  // Exclude onboarding and landing page from sidebar layout
  const isOnboarding = pathname.includes("/host/onboarding");
  const isLandingPage = pathname === "/host";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EC5B13]"></div>
      </div>
    );
  }

  // If onboarding or landing page, just return children
  if (isOnboarding || isLandingPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex">
      {/* Desktop Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-white border-r border-gray-100 transition-all duration-300 z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <Link href="/">
              <Image src="/images/black.png" alt="Logo" width={140} height={35} className="h-7 w-auto" />
            </Link>
          ) : (
            <div className="w-8 h-8 bg-[#EC5B13] rounded-lg flex items-center justify-center text-white font-black">H</div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          <Link 
            href="/host/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${pathname === '/host/dashboard' ? 'bg-[#EC5B13] text-white shadow-lg shadow-[#EC5B13]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <LayoutDashboard size={20} />
            {isSidebarOpen && <span>Dashboard Overview</span>}
          </Link>
          
          <Link 
            href="/host/enquiries" 
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${pathname === '/host/enquiries' ? 'bg-[#EC5B13] text-white shadow-lg shadow-[#EC5B13]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <MessageSquare size={20} />
            {isSidebarOpen && <span>Stay Enquiries</span>}
          </Link>

          <Link 
            href="/host/listings" 
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${pathname === '/host/listings' ? 'bg-[#EC5B13] text-white shadow-lg shadow-[#EC5B13]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <Home size={20} />
            {isSidebarOpen && <span>My Listings</span>}
          </Link>

          <Link 
            href="/host/onboarding" 
            className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-gray-500 hover:bg-[#FFF0E8]/50 hover:text-[#EC5B13] transition-all"
          >
            <Plus size={20} />
            {isSidebarOpen && <span>Add New Property</span>}
          </Link>
        </nav>

        <div className="absolute bottom-8 left-0 right-0 px-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
           <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:block p-2 hover:bg-gray-50 rounded-lg transition-colors">
               <Menu size={20} className="text-gray-400" />
             </button>
             <h1 className="text-xl font-bold text-gray-900">Host Dashboard</h1>
           </div>
           
           <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-gray-900 capitalize">{hostName}</p>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Property Host</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-[#FFF0E8] flex items-center justify-center border border-[#EC5B13]/10">
               <User size={18} className="text-[#EC5B13]" />
             </div>
           </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
