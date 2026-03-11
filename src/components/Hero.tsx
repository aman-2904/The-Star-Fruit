import Image from "next/image";
import { Star, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[85vh] min-h-[700px] w-full pt-2 px-4 md:px-6">
      <div className="relative w-full max-w-[1877px] h-[500px] lg:h-[695px] overflow-hidden rounded-[20px] shadow-2xl mx-auto">
        {/* Background Image */}
        <Image
          src="/images/hero_bg_v2.jpg"
          alt="Luxury villa with pool"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay for readability - slightly darker for better text contrast */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-start pt-8 md:pt-12 text-center text-white p-6">
          {/* Unified Trust Badge Pill */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-4 sm:mb-12 bg-black/20 backdrop-blur-md px-5 py-3 sm:py-2.5 rounded-[20px] sm:rounded-full border border-white/20 shadow-sm">
            <div className="flex items-center space-x-1.5 text-[11px] sm:text-[13px] font-bold uppercase tracking-widest text-white/90">
              <ShieldCheck size={16} strokeWidth={2.5} />
              <span>10,000+ verified stays</span>
            </div>
            <div className="hidden sm:block w-[1.5px] h-3 bg-white/40" />
            <div className="flex items-center space-x-1.5 text-[11px] sm:text-[13px] font-bold uppercase tracking-widest text-white/90">
              <Star size={16} className="text-white fill-white" strokeWidth={2.5} />
              <span>4.8 Average guest rating</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[80px] font-black max-w-7xl leading-[0.95] tracking-tight mb-8 drop-shadow-lg">
            Stays you trust,<br />
            Flexibility you&apos;ll love
          </h1>
        </div>
      </div>
    </section>
  );
}
