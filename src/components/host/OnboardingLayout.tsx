import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  onBack?: () => void;
  onContinue?: () => void;
  canContinue?: boolean;
}

export default function OnboardingLayout({ children, onBack, onContinue, canContinue = true }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col font-sans relative">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-20 py-4 border-b border-gray-200/50 bg-white transition-all duration-300">
        <div className="hidden md:flex items-center space-x-12">
          <Link href="/" className="text-sm font-bold text-gray-800 hover:text-black">Home</Link>
          <Link href="/host" className="text-sm font-bold text-gray-800 hover:text-black">Dashboard</Link>
          <Link href="/host/listings" className="text-sm font-bold text-gray-800 hover:text-black">Listings</Link>
        </div>

        {/* Mobile Menu Button - can use a simple menu icon or hide for onboarding */}
        <div className="md:hidden">
          <button className="p-2 text-gray-800 -ml-2">
             <span className="text-xl font-bold">☰</span>
          </button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <Link href="/host">
            <Image
              src="/images/logo.png"
              alt="The Starfruit Logo"
              width={160}
              height={40}
              className="h-8 md:h-10 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        <div className="flex items-center space-x-4 md:space-x-8">
          <Link href="#" className="hidden md:block text-sm font-bold text-gray-800 hover:text-black">Help</Link>
          <button className="px-4 py-2 bg-[#EC5B13] text-white text-sm font-bold rounded-lg hover:bg-[#D95311] transition-colors shadow-sm whitespace-nowrap">
            Save & Exit
          </button>
          <button className="p-2 border border-gray-200 rounded-full bg-gray-50 hover:shadow-md transition-shadow">
            <User size={20} className="text-gray-600" />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col pt-8 pb-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
