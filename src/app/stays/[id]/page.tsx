"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, MapPin, Share, Heart, Users, BedDouble, Bath, 
  ChevronRight, CheckCircle2, ShieldCheck, Calendar, 
  Wifi, UtensilsCrossed, Wind, Tv2, Waves, Umbrella, 
  ChefHat, Dumbbell, Flame, Loader2, ArrowLeft, User,
  X, ChevronLeft
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewForm from "@/components/ReviewForm";

interface Property {
  id: string;
  listing_title: string;
  listing_description?: string;
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

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
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
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const fetchReviews = async () => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('property_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        if (!supabase) return;
        
        const { data: { session: curSession } } = await supabase.auth.getSession();
        setSession(curSession);

        const { data: propertyData, error: propError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (propError) throw propError;
        setProperty(propertyData);

        await fetchReviews();
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchData();
  }, [id]);

  // Thumbnail Auto-Scroll Sync
  useEffect(() => {
    if (showAllPhotos && thumbnailRefs.current[activePhotoIndex]) {
      thumbnailRefs.current[activePhotoIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [activePhotoIndex, showAllPhotos]);

  // Check for "Show more" description
  useEffect(() => {
    if (property && descriptionRef.current) {
      const isClamped = descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight;
      setHasMore(isClamped);
    }
  }, [property]);

  // Handle Keyboard Navigation
  useEffect(() => {
    if (!showAllPhotos) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAllPhotos(false);
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAllPhotos, activePhotoIndex, property?.images]);

  // Prevent background scroll when gallery is open
  useEffect(() => {
    if (showAllPhotos) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAllPhotos]);

  const openGallery = (index: number) => {
    setActivePhotoIndex(index);
    setShowAllPhotos(true);
  };

  const nextPhoto = () => {
    if (!property?.images) return;
    setActivePhotoIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevPhoto = () => {
    if (!property?.images) return;
    setActivePhotoIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

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

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(2)
    : "New";

  const mainImage = property.images?.[0] || "/images/stays/pool_villa.png";
  const galleryImages = property.images?.slice(1, 4) || []; 
  const lastImage = property.images?.[4];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Premium Full Screen Photo Gallery Modal */}
      {showAllPhotos && property?.images && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in zoom-in duration-300">
          
          {/* Top Bar: Counter and Close */}
          <div className="p-6 flex justify-between items-center text-white z-10">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-widest uppercase opacity-80">
                Photo {activePhotoIndex + 1} of {property.images.length}
              </span>
            </div>
            <button 
              onClick={() => setShowAllPhotos(false)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all group active:scale-90"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Main Stage (Image Area) */}
          <div className="relative flex-1 w-full max-w-7xl mx-auto flex items-center justify-center px-4 md:px-10 group overflow-hidden">
             {/* Navigation Arrows */}
             <button 
                onClick={prevPhoto}
                className="absolute left-6 md:left-10 p-4 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/20 active:scale-95"
             >
                <ChevronLeft size={32} />
             </button>

             <div 
                className="relative w-full h-full max-h-[80vh] flex items-center justify-center cursor-pointer group/image"
                onClick={nextPhoto}
                title="Next photo"
             >
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] group-hover/image:brightness-95 transition-all">
                   <Image 
                     src={property.images[activePhotoIndex]} 
                     alt={`Slide ${activePhotoIndex + 1}`} 
                     fill 
                     className="object-contain"
                     unoptimized
                     priority
                   />
                </div>
             </div>

             <button 
                onClick={nextPhoto}
                className="absolute right-6 md:right-10 p-4 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/20 active:scale-95"
             >
                <ChevronRight size={32} />
             </button>
          </div>

          {/* Thumbnail Strip */}
          <div className="p-10 pb-16 flex flex-col items-center gap-4 w-full">
             <div className="flex items-center gap-4 overflow-x-auto py-6 scrollbar-hide max-w-full px-10 no-scrollbar">
                {property.images.map((img, i) => (
                  <button 
                    key={i} 
                    ref={(el) => { thumbnailRefs.current[i] = el; }}
                    onClick={() => setActivePhotoIndex(i)}
                    className={`relative w-16 h-16 md:w-20 md:h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 ${
                      activePhotoIndex === i 
                        ? "scale-110 ring-4 ring-orange-500 shadow-2xl z-10" 
                        : "opacity-40 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${i+1}`} fill className="object-cover" unoptimized />
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}
      
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
              <span>{avgRating}</span>
              {reviews.length > 0 && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="underline cursor-pointer">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 border-l border-gray-300 pl-4 h-4 my-auto">
              <ShieldCheck size={14} className="text-[#EC5B13]" />
              <span>Superhost</span>
            </div>
            <div className="flex items-center gap-1 underline cursor-pointer border-l border-gray-300 pl-4 h-4 my-auto">
              <MapPin size={14} />
              <span>{property.city}, {property.state}, India</span>
            </div>
          </div>
        </div>

        {/* Dynamic Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 rounded-[20px] overflow-hidden aspect-[4/3] md:aspect-[2/1] relative group mb-10">
          {/* Main Large Image */}
          <div className="md:col-span-2 md:row-span-2 relative h-full overflow-hidden">
            <Image 
              src={mainImage} 
              alt={property.listing_title} 
              fill 
              className="object-cover hover:brightness-90 hover:scale-[1.03] transition-all duration-700 cursor-pointer"
              priority
              unoptimized
              onClick={() => openGallery(0)}
            />
          </div>
          {/* Smaller Images Integration */}
          {galleryImages.map((img, i) => (
            <div key={i} className="hidden md:block relative h-full overflow-hidden">
              <Image 
                src={img} 
                alt={`${property.listing_title} ${i + 2}`} 
                fill 
                className="object-cover hover:brightness-90 hover:scale-[1.05] transition-all duration-700 cursor-pointer"
                unoptimized
                onClick={() => openGallery(i + 1)}
              />
            </div>
          ))}
          {lastImage && (
            <div className="hidden md:block relative h-full overflow-hidden">
              <Image 
                src={lastImage} 
                alt={`${property.listing_title} last`} 
                fill 
                className="object-cover hover:brightness-90 hover:scale-[1.05] transition-all duration-700 cursor-pointer"
                unoptimized
                onClick={() => openGallery(4)}
              />
            </div>
          )}
          {/* Show all photos button */}
          <button 
            onClick={() => openGallery(0)}
            className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md border border-gray-900/10 rounded-xl px-5 py-2.5 text-[13px] font-bold shadow-[0_4px_24px_-1px_rgba(0,0,0,0.2)] hover:bg-white hover:border-[#EC5B13] hover:text-[#EC5B13] flex items-center gap-2.5 z-10 transition-all duration-300 active:scale-95 group/btn"
          >
            <Layout size={16} className="rotate-0 group-hover/btn:scale-110 transition-transform" />
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
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
                <User size={30} className="text-gray-300" />
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
              <div className="relative">
                <p 
                  ref={descriptionRef}
                  className={`text-gray-700 leading-[1.6] whitespace-pre-line font-medium transition-all duration-300 ${isExpanded ? "" : "line-clamp-4"}`}
                >
                  {property.listing_description || property.description || "Welcome to our stunning property. This luxury space offers an unparalleled blend of modern architecture and tropical charm..."}
                </p>
                
                {hasMore && (
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1 font-bold underline text-gray-900 mt-4 hover:text-[#EC5B13] transition-colors"
                  >
                    {isExpanded ? "Show less" : "Show more"} 
                    <ChevronRight size={18} className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
                  </button>
                )}
              </div>
            </div>

            {/* Amenities Section */}
            <div className="py-8 border-b border-gray-100">
              <h3 className="text-[22px] font-bold text-gray-900 mb-6">What this place offers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {property.amenities?.slice(0, 8).map((id) => (
                  <div key={id} className="flex items-center gap-4 text-gray-700">
                    <span className="text-gray-500">{AMENITY_ICONS[id] || <CheckCircle2 size={18} />}</span>
                    <span className="font-medium capitalize">{id.replace(/_/g, ' ')}</span>
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
                  <span className="text-2xl font-bold text-gray-900">Inquiry</span>
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

        {/* Real Reviews Section */}
        <div className="mt-20 pt-16 border-t border-gray-100">
           <div className="flex items-center gap-3 mb-12">
              <Star size={24} className="fill-black" />
              <h2 className="text-3xl font-serif text-gray-900">
                {avgRating} {reviews.length > 0 && `• ${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'}`}
              </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16 mb-20">
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <div key={review.id} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <User size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 capitalize">{review.user_name}</h4>
                        <div className="flex items-center gap-2">
                           <div className="flex items-center gap-0.5">
                             {[...Array(5)].map((_, i) => (
                               <Star key={i} size={10} className={i < review.rating ? "fill-black" : "text-gray-200"} />
                             ))}
                           </div>
                           <span className="text-xs text-gray-400 font-medium">
                              {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                           </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed font-medium">
                      {review.comment}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-gray-50 rounded-[32px] border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium italic">No reviews yet. Be the first to share your experience!</p>
                </div>
              )}
           </div>

           {/* Review Submission Form */}
           <div className="max-w-2xl">
              {session ? (
                <ReviewForm propertyId={property.id} onReviewSubmitted={fetchReviews} />
              ) : (
                <div className="bg-gray-50 rounded-[32px] p-8 text-center border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Want to share your experience?</h3>
                  <p className="text-gray-500 font-medium mb-6">Log in to leave a star rating and comment on this property.</p>
                  <Link 
                    href="/login" 
                    className="inline-block px-8 py-3 bg-[#1A1A24] text-white font-bold rounded-xl hover:bg-black transition-all shadow-md"
                  >
                    Log In to Review
                  </Link>
                </div>
              )}
           </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

// Helper for "Show Photo" icon (used in button)
function Layout({ size, className }: { size: number; className?: string }) {
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
