"use client";

import { Globe, Instagram, AtSign } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white pt-20 pb-16 border-t border-gray-100">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="max-w-xs">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logo.png"
                alt="LuxeVillaz"
                width={160}
                height={40}
                className="h-8 md:h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-[14px] md:text-[15px] leading-relaxed text-[#6B7280]">
              Curating the finest staycations in Goa since 2018. Luxury, privacy, and local charm in every stay.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:pl-8">
            <h3 className="text-[18px] font-bold text-gray-900 mb-6 font-sans">Quick Links</h3>
            <ul className="space-y-4">
              {["Home", "Villas", "Hotels", "Cruise", "Hostels", "Become a Host"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[14px] md:text-[15px] text-[#6B7280] hover:text-black transition-colors font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-[18px] font-bold text-gray-900 mb-6">Support</h3>
            <ul className="space-y-4">
              {["Contact Us", "FAQs", "Terms of Service", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[14px] md:text-[15px] text-[#6B7280] hover:text-black transition-colors font-medium">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div className="lg:pl-4">
            <h3 className="text-[18px] font-bold text-gray-900 mb-6">Follow Us</h3>
            <div className="flex gap-4 mb-10">
              <a href="#" className="p-3 bg-[#FFF1F2] text-[#FF5A5F] rounded-full hover:bg-[#FFE4E6] transition-all">
                <Globe size={20} />
              </a>
              <a href="#" className="p-3 bg-[#FFF1F2] text-[#FF5A5F] rounded-full hover:bg-[#FFE4E6] transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-3 bg-[#FFF1F2] text-[#FF5A5F] rounded-full hover:bg-[#FFE4E6] transition-all">
                <AtSign size={20} />
              </a>
            </div>
            <p className="text-[13px] text-[#9CA3AF] font-medium">
              © 2026 the starfruit Hospitality Pvt Ltd.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
