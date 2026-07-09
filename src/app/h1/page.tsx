import { Metadata } from "next";
import { ShieldAlert, Mail, Phone } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Under Maintenance | LuxeVillaz",
  description: "LuxeVillaz is currently undergoing scheduled maintenance. We will be back online shortly with enhanced luxury stays and private villas.",
  robots: {
    index: false,
    follow: false,
  }
};

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-[#090b0e] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Background decoration blur blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#EC5B13]/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[180px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6 md:px-12 md:py-8 flex justify-center items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-center">
          <Image
            src="/images/footerlogo.webp"
            alt="LuxeVillaz"
            width={160}
            height={40}
            className="h-10 md:h-12 w-auto object-contain"
            priority
          />
        </div>
      </header>

      {/* Main Content */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-3xl mx-auto w-full">
        {/* Animated Alert Icon */}
        <div className="w-16 h-16 bg-[#EC5B13]/10 border border-[#EC5B13]/30 rounded-3xl flex items-center justify-center mb-8 relative animate-pulse">
          <ShieldAlert size={28} className="text-[#EC5B13]" />
          <span className="absolute inset-0 rounded-3xl border border-[#EC5B13] opacity-30 animate-ping"></span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-black font-serif tracking-tight leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Refining Luxury <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC5B13] to-orange-400">For Your Next Escape</span>
        </h1>

        {/* Sub-headline / Explanation */}
        <p className="text-gray-400 text-base sm:text-lg max-w-xl font-medium leading-relaxed mb-12">
          We are currently polishing our booking system and curated villa selection to deliver an even more exquisite guest experience. We will return shortly.
        </p>

        {/* Inquiries Card */}
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[28px] p-6 backdrop-blur-xl shadow-2xl">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-4">Urgent Booking Inquiries?</h3>
          <div className="flex flex-col gap-3">
            <a 
              href="mailto:bookings@luxevillaz.com" 
              className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-white/10 text-gray-200 hover:text-white transition-all text-sm font-semibold"
            >
              <Mail size={18} className="text-[#EC5B13]" />
              bookings@luxevillaz.com
            </a>
            <a 
              href="tel:+919876543210" 
              className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 hover:border-white/10 text-gray-200 hover:text-white transition-all text-sm font-semibold"
            >
              <Phone size={18} className="text-cyan-400" />
              +91 98765 43210
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 text-center text-xs font-semibold text-gray-600 tracking-wider">
        &copy; {new Date().getFullYear()} LUXEVILLAZ. All rights reserved.
      </footer>
    </main>
  );
}
