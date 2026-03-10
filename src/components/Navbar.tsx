import Link from "next/link";
import { Globe, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-6 bg-white sticky top-0 z-50">
      {/* Left: Menu Items */}
      <div className="flex items-center space-x-12">
        <Link href="#" className="font-semibold text-[15px] text-gray-800 hover:text-black transition-colors">Villas</Link>
        <Link href="#" className="font-semibold text-[15px] text-gray-800 hover:text-black transition-colors">Hotels</Link>
        <Link href="#" className="font-semibold text-[15px] text-gray-800 hover:text-black transition-colors">Cruise</Link>
        <Link href="#" className="font-semibold text-[15px] text-gray-800 hover:text-black transition-colors">Hostels</Link>
      </div>

      {/* Center: Logo */}
      <div className="absolute left-1/2 -translate-x-1/2 text-[32px] font-serif font-black tracking-tighter text-black">
        The Starfruit
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-8">
        <button className="text-[15px] font-bold text-gray-800 hover:text-black transition-colors">Become a host</button>
        <button className="flex items-center space-x-2 text-[15px] font-bold text-gray-800 hover:text-black transition-colors">
          <Globe size={20} strokeWidth={2.5} />
          <span>English | INR</span>
        </button>
        <button className="p-2.5 border border-gray-200 rounded-full hover:shadow-md transition-shadow">
          <User size={22} strokeWidth={2.5} />
        </button>
      </div>
    </nav>
  );
}
