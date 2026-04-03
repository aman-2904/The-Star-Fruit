"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, MapPin, Share, Heart, Users, BedDouble, Bath, 
  ChevronRight, CheckCircle2, ShieldCheck, Calendar, 
  Wifi, UtensilsCrossed, Wind, Tv2, Waves, Umbrella, 
  ChefHat, Dumbbell, Flame, Loader2, ArrowLeft 
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Property {
  id: string;
  listing_title: string;
  city: string;
  state: string;
  category: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  beds: number;
  images: string[];
  description: string;
  host_name?: string;
  host_description?: string;
  amenities?: string[];
  house_rules?: any;
}

const AMENITY_ICONS: Record<string, any> = {
  wifi: <Wifi size={18} />,
  kitchen: <UtensilsCrossed size={18} />,
  ac: <Wind size={18} />,
  tv: <Tv2 size={18} />,
  private_pool: <Waves size={18} />,
  beachfront: <Umbrella size={18} />,
  private_chef: <ChefHat size={18} />,
  gym: <Dumbbell size={18} />,
  bbq_grill: <Flame size={18} />,
};

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      try {
        if (!supabase) return;
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProperty(data);
      } catch (err) {
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <Loader2 size={40} className="animate-spin text-[#EC5B13] mb-4" />
          <p className="text-gray-500 font-medium">Loading villa details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Property not found</h1>
        <Link href="/stays" className="text-[#EC5B13] font-bold hover:underline">
          Back to all stays
        </Link>
      </div>
    );
  }

  const mainImage = property.images?.[0] || "/images/stays/pool_villa.png";
  const galleryImages = property.images?.slice(1, 5) || [];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-24 pb-20">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-800 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all text-sm font-semibold underline">
              <Share size={16} /> Share
            </button>
            <button className="flex items-center gap-2 text-gray-800 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all text-sm font-semibold underline">
              <Heart size={16} /> Save
            </button>
          </div>
        </div>

        {/* Title & Top Info Row */}
        <div className="mb-6">
          <h1 className="text-[26px] md:text-[32px] font-serif text-gray-900 tracking-tight leading-tight mb-2">
            {property.listing_title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-medium text-gray-700">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-black" />
              <span>4.92</span>
              <span className="text-gray-400">•</span>
              <span className="underline cursor-pointer">128 reviews</span>
            </div>
            <div className="flex items-center gap-1">
              <ShieldCheck size={14} className="text-[#EC5B13]" />
              <span>Superhost</span>
            </div>
            <div className="flex items-center gap-1 underline cursor-pointer">
              <MapPin size={14} />
              <span>{property.city}, {property.state}, India</span>
            </div>
          </div>
        </div>

        {/* Dynamic Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 rounded-[20px] overflow-hidden aspect-[4/3] md:aspect-[2/1] relative group mb-10">
          {/* Main Large Image */}
          <div className="md:col-span-2 md:row-span-2 relative h-full">
            <Image 
              src={mainImage} 
              alt={property.listing_title} 
              fill 
              className="object-cover hover:brightness-90 transition-all cursor-pointer"
              priority
            />
          </div>
          {/* Smaller Images */}
          {galleryImages.map((img, i) => (
            <div key={i} className="hidden md:block relative h-full">
              <Image 
                src={img} 
                alt={`${property.listing_title} ${i + 2}`} 
                fill 
                className="object-cover hover:brightness-90 transition-all cursor-pointer"
              />
            </div>
          ))}
          {/* Show all photos button */}
          <button className="absolute bottom-6 right-6 bg-white border border-black rounded-lg px-4 py-2 text-sm font-bold shadow-md hover:bg-gray-50 flex items-center gap-2 z-10 transition-transform active:scale-95">
            <Layout size={16} className="rotate-90" />
            Show all photos
          </button>
        </div>

        {/* Content Layout: Main Info | Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start pb-8 border-b border-gray-100">
              <div>
                <h2 className="text-[22px] font-bold text-gray-900 mb-1">
                  Entire {property.category} hosted by {property.host_name || "Maria"}
                </h2>
                <p className="text-gray-600 font-medium tracking-tight">
                  {property.guests} guests • {property.bedrooms} bedrooms • {property.beds} beds • {property.bathrooms} bathrooms
                </p>
              </div>
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-100 shadow-sm">
                <Image 
                  src="/images/host_placeholder.png" 
                  alt="Host Profile" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>

            {/* Highlights Section */}
            <div className="py-8 space-y-6 border-b border-gray-100">
              <div className="flex items-start gap-4">
                <ChefHat className="mt-1 text-gray-500" size={24} />
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight mb-0.5">{property.host_name || "Maria"} is a Superhost</h4>
                  <p className="text-gray-500 text-sm">Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 text-gray-500" size={24} />
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight mb-0.5">Great location</h4>
                  <p className="text-gray-500 text-sm">95% of recent guests gave the location a 5-star rating.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="mt-1 text-gray-500" size={24} />
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight mb-0.5">Free cancellation for 48 hours</h4>
                  <p className="text-gray-500 text-sm">Get a full refund if you change your mind.</p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="py-8 border-b border-gray-100">
              <p className="text-gray-700 leading-[1.6] whitespace-pre-line mb-6 font-medium">
                {property.description || "Welcome to our stunning property. This luxury space offers an unparalleled blend of modern architecture and tropical charm..."}
              </p>
              <button className="flex items-center gap-1 font-bold underline text-gray-900">
                Show more <ChevronRight size={18} />
              </button>
            </div>

            {/* Amenities Section */}
            <div className="py-8 border-b border-gray-100">
              <h3 className="text-[22px] font-bold text-gray-900 mb-6">What this place offers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {property.amenities?.slice(0, 8).map((id) => (
                  <div key={id} className="flex items-center gap-4 text-gray-700">
                    <span className="text-gray-500">{AMENITY_ICONS[id] || <CheckCircle2 size={18} />}</span>
                    <span className="font-medium">{id.replace(/_/g, ' ')}</span>
                  </div>
                )) || (
                  ["Private infinity pool", "Chef on call", "Gourmet kitchen", "Fast wifi - 500 Mbps", "Central air conditioning", "Free parking on premises"].map(item => (
                    <div key={item} className="flex items-center gap-4 text-gray-700">
                      <span className="text-gray-500"><CheckCircle2 size={18} /></span>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))
                )}
              </div>
              <button className="px-6 py-3 border border-black rounded-xl font-bold hover:bg-gray-50 transition-colors">
                Show all {property.amenities?.length || 45} amenities
              </button>
            </div>
          </div>

          {/* Right Column: Sticky Inquiry Card */}
          <div className="lg:block">
            <div className="sticky top-28 p-6 bg-white rounded-[24px] shadow-[0_12px_45px_-10px_rgba(0,0,0,0.15)] border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-2xl font-bold text-gray-900">Details</span>
                </div>
              </div>
              
              <div className="border border-gray-300 rounded-[14px] overflow-hidden mb-6">
                <div className="grid grid-cols-2 border-b border-gray-300">
                  <div className="p-3 border-r border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
                    <p className="text-[10px] font-black uppercase text-gray-900">Check-in</p>
                    <p className="text-sm font-medium text-gray-400">Add date</p>
                  </div>
                  <div className="p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                    <p className="text-[10px] font-black uppercase text-gray-900">Checkout</p>
                    <p className="text-sm font-medium text-gray-400">Add date</p>
                  </div>
                </div>
                <div className="p-3 border-b border-gray-300 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-900">Guests</p>
                      <p className="text-sm font-medium text-gray-900">1 guest</p>
                    </div>
                    <ChevronRight className="rotate-90 text-gray-500" size={18} />
                  </div>
                </div>
                <div className="p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-900">Purpose</p>
                      <p className="text-sm font-medium text-gray-400">Select...</p>
                    </div>
                    <ChevronRight className="rotate-90 text-gray-500" size={18} />
                  </div>
                </div>
              </div>

              <button className="w-full py-4 bg-[#EC5B13] hover:bg-[#d44f0f] text-white rounded-xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] mb-4">
                Inquire Now
              </button>
              
              <p className="text-center text-gray-500 text-xs font-semibold mb-6">You won't be charged yet</p>
              
              <div className="pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-500 hover:text-black transition-colors cursor-pointer text-xs font-bold underline uppercase tracking-widest">
                <MapPin size={14} />
                Report this listing
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Snapshot (Placeholder for design match) */}
        <div className="mt-20 pt-16 border-t border-gray-100">
           <div className="flex items-center gap-3 mb-8">
              <Star size={24} className="fill-black" />
              <h2 className="text-3xl font-serif text-gray-900">4.92 • 128 reviews</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12">
              {/* Review metrics would go here */}
              {[
                { label: "Cleanliness", score: "5.0" },
                { label: "Accuracy", score: "4.9" },
                { label: "Check-in", score: "5.0" },
                { label: "Communication", score: "4.9" },
                { label: "Location", score: "5.0" },
                { label: "Value", score: "4.8" },
              ].map(metric => (
                <div key={metric.label} className="flex items-center justify-between">
                  <span className="text-gray-900 font-medium">{metric.label}</span>
                  <div className="flex items-center gap-4 flex-1 max-w-[140px] md:max-w-[200px] ml-auto">
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: `${parseFloat(metric.score) * 20}%` }}></div>
                    </div>
                    <span className="text-[13px] font-bold text-gray-900 w-6">{metric.score}</span>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

// Helper for "Show Photo" icon (used in button)
function Layout({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}
