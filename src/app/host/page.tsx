"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Minus, Menu } from "lucide-react";
import Footer from "@/components/Footer";

const FAQ_DATA = [
  {
    question: "What types of stays can I book on The starfruit?",
    answer: "We offer a curated selection of luxury hotels, serviced apartments, private villas, and exclusive resorts across Goa's most prestigious locations."
  },
  {
    question: "What payment options are available?",
    answer: "We support all major credit cards, UPI, and bank transfers. Payments are processed through our secure gateway to ensure your transactions are safe."
  },
  {
    question: "Do you offer free cancellation?",
    answer: "Cancellation policies vary by property. You can find specific details on each listing's page under the 'Booking Policy' section."
  },
  {
    question: "Are the stays verified?",
    answer: "Yes, every property on The starfruit undergoes a rigorous verification process to ensure it meets our high standards of luxury and hospitality."
  },
  {
    question: "Do you have long-stay options?",
    answer: "Absolutely! Many of our villas and apartments are ideal for extended stays. Look for the 'Monthly Stays' badge or contact our concierge for personalized recommendations."
  },
  {
    question: "Is support available if I need help?",
    answer: "Our dedicated support team is available 24/7 via chat and phone to assist with any questions or issues during your hosting journey."
  }
];

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`bg-white rounded-2xl mb-4 overflow-hidden shadow-sm border transition-all duration-300 ${isOpen ? 'border-black' : 'border-gray-100 hover:border-gray-200 shadow-sm'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between text-left group"
      >
        <span className="text-gray-900 font-bold text-lg group-hover:text-black transition-colors">
          {question}
        </span>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-black flex items-center justify-center transition-all duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <div className="relative w-4 h-4">
            {/* Horizontal line (Minus) */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white -translate-y-1/2" />
            {/* Vertical line (Plus component) */}
            <div
              className={`absolute top-0 left-1/2 w-[2px] h-full bg-white -translate-x-1/2 transition-all duration-500 ${isOpen ? 'rotate-90 scale-y-0 opacity-0' : 'rotate-0 scale-y-100 opacity-100'}`}
            />
          </div>
        </div>
      </button>
      <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-8' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden px-8">
          <p className="text-gray-600 font-medium leading-relaxed max-w-3xl">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

const CATEGORIES = [
  {
    title: "Hotels",
    description: "Experience full-service comfort with modern rooms, on-site dining, and warm hospitality. Perfect for short trips, business stays, or weekend getaways.",
    image: "/images/cat_hotel.png",
    linkText: "List Hotels"
  },
  {
    title: "Apartments",
    description: "Stay like a local in modern serviced apartments with kitchen and living space. Perfect for long stays or travelers who love home-like comfort.",
    image: "/images/cat_apartment.png",
    linkText: "List Apartments"
  },
  {
    title: "Villas",
    description: "Enjoy spacious private homes designed for relaxation and togetherness. Ideal for families or groups who want luxury, privacy, and a personal touch.",
    image: "/images/cat_villa.png",
    linkText: "List Villas"
  },
  {
    title: "Resorts",
    description: "Escape to destinations that combine comfort, dining, and leisure in one place. Great for holidays, celebrations, and peaceful retreats.",
    image: "/images/cat_resort.png",
    linkText: "List Resorts"
  }
];

export default function HostDashboard() {
  const [loading, setLoading] = useState(true);
  const [hostName, setHostName] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-20 py-4 border-b border-gray-200/50 bg-white transition-all duration-300">
        <div className="hidden md:flex items-center space-x-12">
          <Link href="/" className="text-sm font-bold text-gray-800 hover:text-black">Home</Link>
          <Link href="#" className="text-sm font-bold text-gray-800 hover:text-black">Dashboard</Link>
          <Link href="#" className="text-sm font-bold text-gray-800 hover:text-black">Listings</Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            className="p-2 text-gray-800 -ml-2"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Menu size={24} />
          </button>
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

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden border-b border-gray-100 bg-white px-6 py-4 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="text-base font-bold text-gray-800 hover:text-black">Home</Link>
            <Link href="#" className="text-base font-bold text-gray-800 hover:text-black">Dashboard</Link>
            <Link href="#" className="text-base font-bold text-gray-800 hover:text-black">Listings</Link>
            <Link href="#" className="text-base font-bold text-gray-800 hover:text-black">Help</Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="p-4 md:p-8">
        <div className="max-w-[1400px] mx-auto relative rounded-[40px] overflow-hidden min-h-[650px] flex items-center justify-center text-center">
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

            <button 
              onClick={() => router.push('/host/onboarding')}
              className="px-10 py-5 bg-[#EC5B13B2] text-white rounded-2xl font-black text-lg shadow-2xl shadow-black/20 hover:bg-[#EC5B13B2] transition-all hover:scale-105 active:scale-95"
            >
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

      {/* Property Categories Section */}
      <section className="px-6 md:px-20 py-24 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-black text-gray-900 mb-4 tracking-tight">
                Luxury Property Categories
              </h2>
              <p className="text-gray-500 font-medium text-lg">
                Whatever your slice of paradise, we have a place for it.
              </p>
            </div>

            {/* Carousel Controls (Visual only for now as requested) */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-4 border border-gray-100 rounded-full text-gray-400 hover:bg-gray-50 hover:text-black transition-all">
                <ChevronLeft size={24} />
              </button>
              <button className="p-4 border border-gray-100 rounded-full text-gray-400 hover:bg-gray-50 hover:text-black transition-all">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CATEGORIES.map((cat, idx) => (
              <div
                key={idx}
                className="group bg-[#EEEEEE] rounded-[32px] overflow-hidden border border-transparent hover:border-gray-200 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden m-4 rounded-[24px]">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-8 pt-4">
                  <h3 className="text-2xl font-black text-gray-900 mb-4">{cat.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">
                    {cat.description}
                  </p>
                  <button className="text-sm font-black text-gray-900 flex items-center gap-2 group/btn">
                    {cat.linkText}
                    <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center text-white transition-transform group-hover/btn:translate-x-1">
                      <ChevronRight size={12} />
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-6 md:px-20 py-24 bg-white">
        <div className="max-w-[1400px] mx-auto bg-[#FCF8F5] rounded-[48px] p-8 md:p-16 lg:p-24 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-16 tracking-tight">
                How it Works
              </h2>

              <div className="space-y-12">
                {/* Step 1 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#EC5B13] text-white rounded-full flex items-center justify-center font-black text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 mb-2">List your space</h3>
                    <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
                      Share your property details, high-res photos, and set your own rules and pricing.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#EC5B13] text-white rounded-full flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 mb-2">Welcome guests</h3>
                    <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
                      Screen potential guests and message them through our secure platform.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#EC5B13] text-white rounded-full flex items-center justify-center font-black text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 mb-2">Get paid</h3>
                    <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
                      Receive payments automatically 24 hours after guest check-in, minus our low service fee.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 w-full h-[300px] md:h-[500px] relative rounded-[32px] overflow-hidden shadow-2xl">
              <Image
                src="/images/reception.png"
                alt="Luxury Reception"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-20 py-16 bg-[#EEEEEE]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-black text-center text-gray-900 mb-16 tracking-tight">
            Have questions? We’re here to help
          </h2>

          <div className="space-y-4">
            {FAQ_DATA.map((item, idx) => (
              <FAQItem key={idx} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="px-6 md:px-20 py-14 bg-white">
        <div className="max-w-[1400px] mx-auto relative rounded-[48px] overflow-hidden min-h-[450px] flex flex-col items-center justify-center text-center px-6">
          <Image
            src="/images/hostCTA.jpg"
            alt="Luxury Villa Golden Hour"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />

          <div className="relative z-10 w-full max-w-4xl py-12">
            <h2 className="text-4xl md:text-5xl font-serif font-black text-white mb-4 tracking-tight drop-shadow-2xl">
              Connect with Excellence
            </h2>
            <p className="text-white font-medium text-xs md:text-sm max-w-lg mx-auto mb-10 leading-relaxed opacity-90">
              Whether you're looking for a seasonal retreat or a permanent luxury residence in Goa, our team is dedicated to finding your perfect sanctuary.
            </p>

            {/* Glass Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-[40px] p-8 md:px-12 md:py-6 shadow-2xl max-w-xl mx-auto">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Ready to Host?</h3>
              <p className="text-white text-xs md:text-sm font-bold mb-8 max-w-md mx-auto leading-relaxed opacity-80">
                Join Goa's most exclusive network of luxury property owners and start earning today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => router.push('/host/onboarding')}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-[#EC5B13] rounded-2xl font-black text-base hover:bg-gray-50 transition-all hover:scale-[1.02] active:scale-95 shadow-xl"
                >
                  Start Your Listing
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-[#96897E]/40 text-white border border-white/20 rounded-2xl font-black text-base hover:bg-[#96897E]/50 transition-all hover:scale-[1.02] active:scale-95 backdrop-blur-md">
                  Talk to an Expert
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
