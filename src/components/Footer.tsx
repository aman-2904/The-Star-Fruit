"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";

const WATERMARK = "LUXEVILLAZ".split("");

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .wm-letter { 
          font-size: clamp(38px, 11.5vw, 220px); 
          letter-spacing: -0.06em;
        }
        @media (min-width: 768px) { 
          .wm-letter { 
            font-size: clamp(80px, 18vw, 220px); 
            letter-spacing: -0.02em;
          } 
        }
      `}</style>
      <footer className="px-4 md:px-8 pb-8" ref={footerRef}>
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{ background: '#1C1F26' }}
      >
        {/* Giant animated watermark */}
        <div
          className="absolute bottom-0 left-0 right-0 leading-none select-none pointer-events-none overflow-hidden flex justify-between w-full"
          aria-hidden="true"
        >
          {WATERMARK.map((letter, i) => (
            <span
              key={i}
              className="wm-letter font-black uppercase"
              style={{
                lineHeight: 0.85,
                color: 'rgba(255, 255, 255, 0.06)',
                display: 'inline-block',
                transform: inView ? 'translateY(0)' : 'translateY(60px)',
                opacity: inView ? 1 : 0,
                transition: `transform 0.8s cubic-bezier(0.22,1,0.36,1), opacity 0.8s ease`,
                transitionDelay: `${i * 60}ms`,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 px-8 md:px-16 pt-36 pb-24 md:pb-44">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">

            {/* Column 1: Brand */}
            <div className="max-w-xs">
              <Link href="/" className="inline-block mb-5">
                <Image
                  src="/images/white.png"
                  alt="LuxeVillaz"
                  width={160}
                  height={40}
                  className="h-10 md:h-12 w-auto object-contain"
                />
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                Curating the finest staycations in Goa since 2018. Luxury, privacy, and local charm in every stay.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-[#EC5B13] font-bold text-sm uppercase tracking-wider mb-5">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {["Home", "Villas", "Cruise", "Stays", "Become a Host"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-300 text-sm hover:text-white transition-colors font-medium"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h3 className="text-[#EC5B13] font-bold text-sm uppercase tracking-wider mb-5">
                Support
              </h3>
              <ul className="space-y-3">
                {["Contact Us", "FAQs", "Terms of Service", "Privacy Policy"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-300 text-sm hover:text-white transition-colors font-medium"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Follow Us */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
                Follow Us
              </h3>
              <div className="flex items-center gap-3 mb-8">
                {/* Globe / Website */}
                <a href="#" aria-label="Website" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#EC5B13] transition-colors flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                </a>
                {/* Instagram */}
                <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#EC5B13] transition-colors flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                </a>
                {/* Email */}
                <a href="#" aria-label="Email" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#EC5B13] transition-colors flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                </a>
                {/* Twitter/X */}
                <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#EC5B13] transition-colors flex items-center justify-center">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" /></svg>
                </a>
                {/* Facebook */}
                <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#EC5B13] transition-colors flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                </a>
              </div>

              <p className="text-gray-500 text-xs">
                © 2024 the luxevillaz Hospitality Pvt Ltd.
              </p>
            </div>

          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
