import Link from "next/link";
import Image from "next/image";
import { Globe, User, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-4 md:px-10 py-3 md:py-3 bg-white sticky top-0 z-50">
      {/* Left: Menu Items (Desktop) */}
      <div className="hidden lg:flex items-center space-x-12">
        <Link href="#" className="font-semibold text-[15px] text-gray-800 hover:text-black transition-colors">Villas</Link>
        <Link href="#" className="font-semibold text-[15px] text-gray-800 hover:text-black transition-colors">Hotels</Link>
        <Link href="#" className="font-semibold text-[15px] text-gray-800 hover:text-black transition-colors">Cruise</Link>
        <Link href="#" className="font-semibold text-[15px] text-gray-800 hover:text-black transition-colors">Hostels</Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button className="p-2 text-gray-800">
          <Menu size={24} />
        </button>
      </div>

      {/* Center: Logo */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <Link href="/">
          <Image
            src="/images/logo.png"
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
        <button className="hidden sm:block text-[15px] font-bold text-gray-800 hover:text-black transition-colors">Become a host</button>
        <button className="flex items-center space-x-1 md:space-x-2 text-[15px] font-bold text-gray-800 hover:text-black transition-colors">
          <Globe size={20} strokeWidth={2.5} className="w-[18px] h-[18px] md:w-5 md:h-5" />
          <span className="hidden md:inline">English | INR</span>
        </button>
        <button className="p-1.5 md:p-2.5 border border-gray-200 rounded-full hover:shadow-md transition-shadow">
          <User size={22} strokeWidth={2.5} className="w-[18px] h-[18px] md:w-6 md:h-6" />
        </button>
      </div>
    </nav>
  );
}
