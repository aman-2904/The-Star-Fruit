import Image from "next/image";
import { Star, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-[85vh] min-h-[700px] w-full px-6 pt-2">
      <div className="relative h-full w-full overflow-hidden rounded-[48px] shadow-2xl">
        {/* Background Image */}
        <Image
          src="/images/hero_bg.png"
          alt="Lush travel destination"
          fill
          className="object-cover"
          priority
        />

        {/* Overlay for readability - slightly darker for better text contrast */}
        <div className="absolute inset-0 bg-black/15" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white p-6">
          {/* Unified Trust Badge Pill */}
          <div className="flex items-center space-x-3 mb-12 bg-black/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 shadow-sm">
            <div className="flex items-center space-x-1.5 text-[13px] font-bold uppercase tracking-widest text-white/90">
              <ShieldCheck size={16} strokeWidth={2.5} />
              <span>10,000+ verified stays</span>
            </div>
            <div className="w-[1.5px] h-3 bg-white/40" />
            <div className="flex items-center space-x-1.5 text-[13px] font-bold uppercase tracking-widest text-white/90">
              <Star size={16} className="text-white fill-white" strokeWidth={2.5} />
              <span>4.8 Average guest rating</span>
            </div>
          </div>

          <h1 className="text-6xl md:text-6xl lg:text-[80px] font-black max-w-7xl leading-[0.95] tracking-tight mb-8 drop-shadow-lg">
            Stays you trust,<br />
            Flexibility you&apos;ll love
          </h1>
        </div>
      </div>
    </section>
  );
}
