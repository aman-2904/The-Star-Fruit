"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const propertyName = searchParams ? searchParams.get("property_name") : null;
  const propertySlug = searchParams ? searchParams.get("property_slug") : null;

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-gray-50/30">
      <div className="w-full max-w-[480px] bg-white rounded-[24px] shadow-[0_12px_45px_-10px_rgba(0,0,0,0.15)] border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Inquiry</h1>
        </div>

        <div className="bg-[#EAFBF3] rounded-[24px] p-8 text-center border border-[#DCF7EA] transition-all duration-300 hover:scale-[1.01]">
          <div className="w-16 h-16 bg-[#00BA74] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#00BA74]/20 animate-bounce-slow">
            <CheckCircle2 size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#004D30] mb-3">Enquiry Sent!</h3>
          <p className="text-[#007A4B] text-[15px] font-medium leading-relaxed mb-6">
            {propertyName ? (
              <>
                Our team will contact you shortly regarding your stay at{" "}
                <span className="font-bold text-[#004D30]">{propertyName}</span>.
              </>
            ) : (
              "Our team will contact you shortly regarding your stay."
            )}
          </p>
          {propertySlug ? (
            <Link
              href={`/stays/${propertySlug}`}
              className="inline-block text-[#00BA74] font-bold text-[15px] underline hover:text-[#007A4B] transition-colors"
            >
              Send another inquiry
            </Link>
          ) : (
            <Link
              href="/stays"
              className="inline-block text-[#00BA74] font-bold text-[15px] underline hover:text-[#007A4B] transition-colors"
            >
              Explore stays
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function ThankYouFallback() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-gray-50/30">
      <div className="w-full max-w-[480px] bg-white rounded-[24px] shadow-[0_12px_45px_-10px_rgba(0,0,0,0.15)] border border-gray-100 p-6 flex items-center justify-center min-h-[300px]">
        <Loader2 size={32} className="animate-spin text-[#00BA74]" />
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      <Navbar />
      <Suspense fallback={<ThankYouFallback />}>
        <ThankYouContent />
      </Suspense>
      <Footer />
    </main>
  );
}
