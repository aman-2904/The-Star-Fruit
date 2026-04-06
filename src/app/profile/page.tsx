"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StayCard from "@/components/StayCard";
import { User, LogOut, Settings, Heart, CalendarDays } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"saved" | "account" | "bookings">("saved");
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [savedProperties, setSavedProperties] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUser() {
      if (!supabase) return;
      
      const { data: { session: curSession }, error } = await supabase.auth.getSession();
      
      if (error || !curSession) {
        router.push("/login"); // Redirect if not logged in
        return;
      }
      
      setSession(curSession);
      fetchSavedProperties(curSession.user.id);
    }
    
    fetchUser();
  }, [router]);

  async function fetchSavedProperties(userId: string) {
    if (!supabase) return;
    try {
      // We join the properties table to get the actual property details
      const { data, error } = await supabase
        .from('saved_properties')
        .select(`
          id,
          properties!inner (
            id,
            listing_title,
            city,
            state,
            category,
            bedrooms,
            images
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        // If the table doesn't exist yet (SQL script not run), just fail gracefully
        console.error("Error fetching saved properties:", error.message);
        setSavedProperties([]);
      } else if (data) {
        // Extract properties from the join
        const mappedProperties = data
          .map((item: any) => item.properties)
          .filter(Boolean); // remove nulls just in case
        setSavedProperties(mappedProperties);
      }
    } catch (err) {
      console.error("Error fetching saved:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/");
  };

  const userFullName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || "Guest";

  if (!session && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#EC5B13] animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 md:px-10 max-w-[1400px] w-full mx-auto">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 w-full mt-4">
          
          {/* Sidebar / User Card */}
          <div className="w-full md:w-72 lg:w-80 shrink-0">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden sticky top-32">
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-24 h-24 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner mb-4">
                  <User size={40} className="text-gray-400" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 capitalize mb-1">{userFullName}</h1>
                <p className="text-sm font-semibold text-gray-500 mb-6">{session?.user?.email}</p>
                <div className="w-full h-px bg-gray-100 mb-6"></div>
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-red-600 hover:bg-red-50 py-3 rounded-xl transition-colors"
                >
                  <LogOut size={16} /> Log out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-grow">
            <h2 className="text-[32px] md:text-[40px] font-serif tracking-tight text-gray-900 mb-8">My Profile</h2>
            
            {/* Tabs */}
            <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-10 pb-2">
              <button 
                onClick={() => setActiveTab("saved")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                  activeTab === "saved" 
                    ? "bg-black text-white shadow-md shadow-black/10" 
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Heart size={16} className={activeTab === "saved" ? "fill-white" : ""} /> Saved Properties
              </button>
              
              <button 
                onClick={() => setActiveTab("bookings")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                  activeTab === "bookings" 
                    ? "bg-black text-white shadow-md shadow-black/10" 
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <CalendarDays size={16} /> My Bookings
              </button>

              <button 
                onClick={() => setActiveTab("account")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                  activeTab === "account" 
                    ? "bg-black text-white shadow-md shadow-black/10" 
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Settings size={16} /> Account Settings
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <span className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#EC5B13] animate-spin"></span>
                </div>
              ) : (
                <>
                  {activeTab === "saved" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                      {savedProperties.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {savedProperties.map((prop) => (
                            <StayCard 
                              key={prop.id}
                              id={prop.id}
                              title={prop.listing_title}
                              location={`${prop.city || ""}${prop.state ? `, ${prop.state}` : ""}`}
                              category={prop.category || "Entire Home"}
                              bedrooms={prop.bedrooms}
                              image={prop.images?.[0] || "/images/stays/pool_villa.png"}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl">
                          <Heart size={48} className="mx-auto text-gray-200 mb-4" />
                          <h3 className="text-lg font-bold text-gray-900 mb-2">No saved properties yet</h3>
                          <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">Hit the heart icon on any property that catches your eye to save it here for later.</p>
                          <button 
                            onClick={() => router.push("/stays")}
                            className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
                          >
                            Explore Stays
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "bookings" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 text-center py-20 bg-white border border-gray-100 rounded-3xl">
                      <CalendarDays size={48} className="mx-auto text-gray-200 mb-4" />
                      <h3 className="text-lg font-bold text-gray-900 mb-2">No bookings found</h3>
                      <p className="text-gray-500 text-sm">You haven't made any bookings yet.</p>
                    </div>
                  )}

                  {activeTab === "account" && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 bg-white border border-gray-100 rounded-3xl p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Personal details</h3>
                      <div className="grid gap-6 max-w-2xl">
                        <div className="flex flex-col gap-2 border-b border-gray-100 pb-5">
                          <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Full Name</span>
                          <span className="text-gray-900 font-medium capitalize">{userFullName}</span>
                        </div>
                        <div className="flex flex-col gap-2 pb-5">
                          <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Email Address</span>
                          <span className="text-gray-900 font-medium">{session?.user?.email}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
