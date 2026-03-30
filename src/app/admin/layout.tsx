"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, Users, Clock, CheckCircle, LogOut, Menu, X, Home, MessageSquare } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAdmin() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        if (!pathname.includes("/admin/login") && !pathname.includes("/admin/signup")) {
          router.push("/admin/login");
        }
        setLoading(false);
        return;
      }

      const user = session.user;
      if (user?.user_metadata?.role !== 'admin') {
        if (!pathname.includes("/admin/login") && !pathname.includes("/admin/signup")) {
          router.push("/");
        }
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
      setLoading(false);
    }

    checkAdmin();
  }, [router, pathname]);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      router.push("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EC5B13]"></div>
      </div>
    );
  }

  // Allow access to login/signup without layout or extra checks
  if (pathname.includes("/admin/login") || pathname.includes("/admin/signup")) {
    return <>{children}</>;
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-white border-r border-gray-100 transition-all duration-300 z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen ? (
            <Image src="/images/black.png" alt="Logo" width={140} height={35} className="h-7 w-auto" />
          ) : (
            <div className="w-8 h-8 bg-[#EC5B13] rounded-lg flex items-center justify-center text-white font-black">S</div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <nav className="mt-8 px-4 space-y-2">
          <Link 
            href="/admin/dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${pathname === '/admin/dashboard' ? 'bg-[#EC5B13] text-white shadow-lg shadow-[#EC5B13]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <LayoutDashboard size={20} />
            {isSidebarOpen && <span>Dashboard Overview</span>}
          </Link>
          <Link 
            href="/admin/listings" 
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${pathname === '/admin/listings' ? 'bg-[#EC5B13] text-white shadow-lg shadow-[#EC5B13]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <Home size={20} />
            {isSidebarOpen && <span>Property Listings</span>}
          </Link>
          <Link 
            href="/admin/users" 
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${pathname === '/admin/users' ? 'bg-[#EC5B13] text-white shadow-lg shadow-[#EC5B13]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <Users size={20} />
            {isSidebarOpen && <span>Manage Users</span>}
          </Link>
          <Link 
            href="/admin/enquiries" 
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${pathname === '/admin/enquiries' ? 'bg-[#EC5B13] text-white shadow-lg shadow-[#EC5B13]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <MessageSquare size={20} />
            {isSidebarOpen && <span>Enquiries</span>}
          </Link>
          <Link 
            href="#" 
            className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm text-gray-400 cursor-not-allowed"
          >
            <Clock size={20} />
            {isSidebarOpen && <span>Activity Logs</span>}
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
             <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
           </div>
           
           <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-bold text-gray-900">Super Admin</p>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Administrator</p>
             </div>
             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
               <span className="font-bold text-[#EC5B13]">A</span>
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
