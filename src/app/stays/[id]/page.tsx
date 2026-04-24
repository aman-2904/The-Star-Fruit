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
  X, ChevronLeft, Monitor, Sparkles, Coffee, Car,
  Shield, Thermometer, Laptop, Briefcase, Zap,
  Sun, Moon, Accessibility, ParkingCircle,
  HeartPulse, BellElectric, Trophy, WashingMachine,
  Refrigerator, Microwave, Shovel, Trees, Home, Music,
  UserCheck, Baby, Ghost, Layout, Smartphone, Book,
  Gamepad2, GraduationCap, Beer, Wine, CupSoda, Shirt,
  DoorOpen, Lock, Fan, Speaker, CalendarDays, Boxes,
  ShowerHead, Soup, AlertCircle, ConciergeBell, Sprout, Bed
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewForm from "@/components/ReviewForm";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface Property {
  id: string;
  listing_title: string;
  listing_description?: string;
  street_address?: string;
  city: string;
  state: string;
  pincode?: string;
  category: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  beds: number;
  images: string[];
  description: string;
  host_name?: string;
  host_description?: string;
  amenities?: string[];
  house_rules?: Record<string, boolean>;
  custom_rules?: string[];
  latitude?: number;
  longitude?: number;
}

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const AMENITY_ICONS: Record<string, any> = {
  // Essentials
  wifi: <Wifi size={18} />,
  ac: <Wind size={18} />,
  tv: <Tv2 size={18} />,
  workspace: <Monitor size={18} />,
  washer: <WashingMachine size={18} />,
  dryer: <Wind size={18} />,
  ethernet: <Zap size={18} />,
  housekeeping: <UserCheck size={18} />,

  // Luxury
  private_pool: <Waves size={18} />,
  hot_tub: <Bath size={18} />,
  beachfront: <Umbrella size={18} />,
  private_chef: <ChefHat size={18} />,
  private_gym: <Dumbbell size={18} />,
  gym: <Dumbbell size={18} />,
  bbq_grill: <Flame size={18} />,
  sound_system: <Music size={18} />,
  game_console: <Gamepad2 size={18} />,
  barbecue: <Flame size={18} />,
  shared_pool: <Waves size={18} />,
  chef_on_request: <ChefHat size={18} />,
  room_service: <ConciergeBell size={18} />,
  massage: <Sprout size={18} />,

  // Bathroom & Bedroom
  hair_dryer: <Wind size={18} />,
  shampoo: <CupSoda size={18} />,
  hot_water: <Thermometer size={18} />,
  hangers: <Shirt size={18} />,
  iron: <Shirt size={18} />,
  safe: <Lock size={18} />,
  bed_linens: <Home size={18} />,
  mosquito_net: <Shield size={18} />,
  shower_head: <ShowerHead size={18} />,
  towels: <Home size={18} />,
  extra_pillows: <Bed size={18} />,
  darkening_blinds: <Moon size={18} />,

  // Kitchen & Dining
  kitchen: <UtensilsCrossed size={18} />,
  refrigerator: <Refrigerator size={18} />,
  microwave: <Microwave size={18} />,
  coffee_maker: <Coffee size={18} />,
  kettle: <Coffee size={18} />,
  cooking_basics: <UtensilsCrossed size={18} />,
  dishwasher: <WashingMachine size={18} />,
  stove: <Layout size={18} />,
  wine_glasses: <Wine size={18} />,
  dining_table: <Layout size={18} />,

  // Family & Fun
  crib: <Baby size={18} />,
  high_chair: <Baby size={18} />,
  board_games: <Ghost size={18} />,
  books: <Book size={18} />,
  pool_table: <Monitor size={18} />,

  // Parking & Facilities
  free_parking: <Car size={18} />,
  parking: <Car size={18} />,
  ev_charger: <Zap size={18} />,
  garden: <Trees size={18} />,
  elevator: <Home size={18} />,
  single_level: <Home size={18} />,

  // Outdoor
  patio: <Layout size={18} />,
  backyard: <Trees size={18} />,
  entrance: <Home size={18} />,
  outdoor_dining: <UtensilsCrossed size={18} />,
  hammock: <Umbrella size={18} />,
  terrace: <Layout size={18} />,
  sun_deck: <Sun size={18} />,

  // Safety & Services
  first_aid: <HeartPulse size={18} />,
  extinguisher: <Flame size={18} />,
  smoke_alarm: <BellElectric size={18} />,
  carbon_alarm: <BellElectric size={18} />,
  security_cam: <Shield size={18} />,
  luggage_drop: <Briefcase size={18} />,
  long_term: <CalendarDays size={18} />,

  // Fallbacks/Extras
  breakfast: <Coffee size={18} />,
  laptop_friendly: <Laptop size={18} />,
  office: <Briefcase size={18} />,
  essentials: <CheckCircle2 size={18} />,
};

export default function PropertyDetailsPage() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places'] as any
  });
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Enquiry Form State
  const [enquiryData, setEnquiryData] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "1",
    purpose: ""
  });
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquiryStatus, setEnquiryStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [enquiryError, setEnquiryError] = useState("");

  const handleEnquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEnquiryData(prev => ({ ...prev, [name]: value }));
  };

  const submitEnquiry = async () => {
    if (!supabase) return;

    // Basic validation
    if (!enquiryData.fullName || !enquiryData.email || !enquiryData.phone || !enquiryData.checkIn || !enquiryData.checkOut) {
      setEnquiryError("Please fill in all required fields.");
      setEnquiryStatus('error');
      return;
    }

    setEnquiryLoading(true);
    setEnquiryStatus('idle');
    setEnquiryError("");

    try {
      const { error } = await supabase.from('property_enquiries').insert([
        {
          property_id: id,
          user_id: session?.user?.id || null,
          full_name: enquiryData.fullName,
          email: enquiryData.email,
          phone: enquiryData.phone,
          check_in: enquiryData.checkIn,
          check_out: enquiryData.checkOut,
          guests: parseInt(enquiryData.guests),
          purpose: enquiryData.purpose,
          status: 'pending'
        }
      ]);

      if (error) throw error;

      setEnquiryStatus('success');
      // Reset non-user fields
      setEnquiryData(prev => ({
        ...prev,
        checkIn: "",
        checkOut: "",
        guests: "1",
        purpose: ""
      }));
    } catch (err: any) {
      console.error("Enquiry submission error:", err);
      setEnquiryError(err.message || "Failed to submit enquiry. Please try again.");
      setEnquiryStatus('error');
    } finally {
      setEnquiryLoading(false);
    }
  };

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

        if (curSession) {
          const { data: savedData } = await supabase
            .from('saved_properties')
            .select('id')
            .eq('user_id', curSession.user.id)
            .eq('property_id', id)
            .maybeSingle();

          if (savedData) setIsSaved(true);

          // Pre-fill enquiry form
          setEnquiryData(prev => ({
            ...prev,
            fullName: curSession.user?.user_metadata?.full_name || "",
            email: curSession.user?.email || "",
            phone: curSession.user?.user_metadata?.phone || ""
          }));
        }

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


  // Handle Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showAllPhotos || !property?.images) return;
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'Escape') setShowAllPhotos(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAllPhotos, activePhotoIndex, property]);

  // Hero Image Infinite Slideshow
  useEffect(() => {
    if (!property?.images || property.images.length <= 1 || showAllPhotos) return;
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % property.images!.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [property?.images, showAllPhotos]);

  const handleToggleSave = async () => {
    if (!supabase) return;
    if (!session) {
      router.push("/login?redirect=/stays/" + id);
      return;
    }

    // Optimistic UI Update
    const newSaveState = !isSaved;
    setIsSaved(newSaveState);

    try {
      if (!newSaveState) {
        await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', session.user.id)
          .eq('property_id', id);
      } else {
        await supabase
          .from('saved_properties')
          .insert({ user_id: session.user.id, property_id: id });
      }
    } catch (err) {
      console.error("Error toggling save:", err);
      setIsSaved(!newSaveState); // Revert on failure
    }
  };

  // Prevent background scroll when any modal is open
  useEffect(() => {
    if (showAllPhotos || showAmenitiesModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAllPhotos, showAmenitiesModal]);

  const openGallery = (index: number) => {
    setActivePhotoIndex(index);
    setShowAllPhotos(true);
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: property?.listing_title || "Premium Stay",
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error("Error sharing:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
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
                  className={`relative w-16 h-16 md:w-20 md:h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 ${activePhotoIndex === i
                    ? "scale-110 ring-4 ring-orange-500 shadow-2xl z-10"
                    : "opacity-40 hover:opacity-100"
                    }`}
                >
                  <Image src={img} alt={`Thumb ${i + 1}`} fill className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Amenities Modal */}
      {showAmenitiesModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">What this place offers</h2>
              <button
                onClick={() => setShowAmenitiesModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-900" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                {property.amenities?.map((id) => {
                  const normalizedId = id.toLowerCase().replace(/\s+/g, '_');
                  return (
                    <div key={id} className="flex items-center gap-4 text-gray-700 pb-6 border-b border-gray-50 last:border-0 sm:[&:nth-last-child(-n+2)]:border-0">
                      <span className="text-gray-500">
                        {AMENITY_ICONS[normalizedId] || <CheckCircle2 size={24} strokeWidth={1.5} />}
                      </span>
                      <span className="font-medium text-[15px] capitalize">
                        {id.replace(/_/g, ' ')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-4 md:px-10 pt-6 pb-20">
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
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-800 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all text-sm font-semibold underline"
            >
              {isCopied ? <CheckCircle2 size={16} className="text-emerald-600" /> : <Share size={16} />}
              {isCopied ? "Copied!" : "Share"}
            </button>
            <button
              onClick={handleToggleSave}
              className="flex items-center gap-2 text-gray-800 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all text-sm font-semibold underline"
            >
              <Heart size={16} className={isSaved ? "fill-red-500 text-red-500" : ""} />
              {isSaved ? "Saved" : "Save"}
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
              <span>
                {[
                  property.street_address,
                  property.city,
                  `${property.state} ${property.pincode || ""}`.trim(),
                  "India"
                ].filter(Boolean).join(", ")}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 rounded-[20px] overflow-hidden aspect-[4/3] md:aspect-[2/1] relative group mb-10 bg-gray-100">
          {/* Main Large Image Slider */}
          <div className="md:col-span-2 md:row-span-2 relative h-full overflow-hidden">
            {property.images && property.images.length > 0 ? (
              property.images.map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt={`${property.listing_title} - Photo ${i + 1}`}
                  fill
                  className={`object-cover transition-opacity duration-1000 absolute inset-0 ${i === heroImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                  priority={i === 0}
                  unoptimized
                />
              ))
            ) : (
              <Image
                src="/images/stays/pool_villa.png"
                alt={property.listing_title}
                fill
                className="object-cover"
                priority
              />
            )}

            {/* Interactive Overlay Layer */}
            <div
              className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 z-20 cursor-pointer"
              onClick={() => openGallery(heroImageIndex)}
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
                  {property.max_guests} {property.max_guests === 1 ? 'guest' : 'guests'} • {property.bedrooms} {property.bedrooms === 1 ? 'bedroom' : 'bedrooms'} • {property.beds} {property.beds === 1 ? 'bed' : 'beds'} • {property.bathrooms} {property.bathrooms === 1 ? 'bathroom' : 'bathrooms'}
                </p>
              </div>
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-gray-50 flex items-center justify-center">
                <User size={30} className="text-gray-300" />
              </div>
            </div>

            {/* Highlights Section */}
            <div className="py-8 space-y-6 border-b border-gray-100">
              <div className="flex items-start gap-4">
                <ChefHat className="mt-1 text-gray-500 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight mb-0.5">{property.host_name || "Maria"} is a Superhost</h4>
                  <p className="text-gray-500 text-sm">
                    {property.host_description || "Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests."}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 text-gray-500 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-gray-900 leading-tight mb-0.5">Great location</h4>
                  <p className="text-gray-500 text-sm">95% of recent guests gave the location a 5-star rating.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Calendar className="mt-1 text-gray-500 shrink-0" size={24} />
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

                {(property.listing_description?.length || property.description?.length || 0) > 250 && (
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
                {property.amenities?.slice(0, 6).map((id) => {
                  const normalizedId = id.toLowerCase().replace(/\s+/g, '_');
                  return (
                    <div key={id} className="flex items-center gap-4 text-gray-700">
                      <span className="text-gray-500">{AMENITY_ICONS[normalizedId] || <CheckCircle2 size={18} />}</span>
                      <span className="font-medium capitalize">{id.replace(/_/g, ' ')}</span>
                    </div>
                  );
                }) || (
                    ["Private infinity pool", "Chef on call", "Gourmet kitchen", "Fast wifi - 500 Mbps", "Central air conditioning", "Free parking on premises"].map(item => (
                      <div key={item} className="flex items-center gap-4 text-gray-700">
                        <span className="text-gray-500"><CheckCircle2 size={18} /></span>
                        <span className="font-medium">{item}</span>
                      </div>
                    ))
                  )}
              </div>
              <button
                onClick={() => setShowAmenitiesModal(true)}
                className="px-6 py-3 border border-black rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Show all {property.amenities?.length || 45} amenities
              </button>
            </div>

            {/* House Rules Section */}
            {(property.house_rules || (property.custom_rules && property.custom_rules.length > 0)) && (
              <div className="py-8 border-b border-gray-100">
                <h3 className="text-[22px] font-bold text-gray-900 mb-6">House rules</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                  {/* Standard Rules */}
                  {property.house_rules && Object.keys(property.house_rules).map(key => {
                    const isAllowed = property.house_rules![key];
                    const label = key.charAt(0).toUpperCase() + key.slice(1);
                    return (
                      <div key={key} className="flex items-center gap-3 text-gray-700">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${isAllowed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className="font-medium text-[15.5px]">
                          {isAllowed ? `${label} Allowed` : `No ${label}`}
                        </span>
                      </div>
                    );
                  })}

                  {/* Custom Rules */}
                  {property.custom_rules?.map((rule, i) => (
                    <div key={i} className="flex items-start gap-3 text-gray-700">
                      <div className="w-2 h-2 rounded-full bg-gray-400 mt-2 shrink-0" />
                      <span className="font-medium text-[15.5px] leading-snug">{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Inquiry Card */}
          <div className="lg:block">
            <div className="sticky top-28 p-6 bg-white rounded-[24px] shadow-[0_12px_45px_-10px_rgba(0,0,0,0.15)] border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-2xl font-bold text-gray-900">Inquiry</span>
                </div>
              </div>

              {enquiryStatus === 'success' ? (
                <div className="bg-emerald-50 rounded-[24px] p-8 text-center border border-emerald-100 animate-in fade-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                    <CheckCircle2 size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-900 mb-2">Enquiry Sent!</h3>
                  <p className="text-emerald-700 text-sm font-medium leading-relaxed">
                    Our team will contact you shortly regarding your stay at {property.listing_title}.
                  </p>
                  <button
                    onClick={() => setEnquiryStatus('idle')}
                    className="mt-6 text-emerald-600 font-bold text-sm underline hover:text-emerald-800 transition-colors"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {/* User Info Section (Only if not pre-filled/logged in or needs edit) */}
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={enquiryData.fullName}
                        onChange={handleEnquiryChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/10 focus:border-[#EC5B13] transition-all"
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={enquiryData.email}
                        onChange={handleEnquiryChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/10 focus:border-[#EC5B13] transition-all"
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={enquiryData.phone}
                        onChange={handleEnquiryChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EC5B13]/10 focus:border-[#EC5B13] transition-all"
                      />
                    </div>

                    <div className="border border-gray-300 rounded-[14px] overflow-hidden">
                      <div className="grid grid-cols-2 border-b border-gray-300">
                        <div className="p-3 border-r border-gray-300 hover:bg-gray-50 transition-colors relative">
                          <p className="text-[10px] font-black uppercase text-gray-900 mb-1">Check-in</p>
                          <input
                            type="date"
                            name="checkIn"
                            value={enquiryData.checkIn}
                            onChange={handleEnquiryChange}
                            className="w-full text-xs font-bold text-gray-900 bg-transparent focus:outline-none cursor-pointer"
                          />
                        </div>
                        <div className="p-3 hover:bg-gray-50 transition-colors relative">
                          <p className="text-[10px] font-black uppercase text-gray-900 mb-1">Checkout</p>
                          <input
                            type="date"
                            name="checkOut"
                            value={enquiryData.checkOut}
                            onChange={handleEnquiryChange}
                            className="w-full text-xs font-bold text-gray-900 bg-transparent focus:outline-none cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="p-3 border-b border-gray-300 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="w-full">
                            <p className="text-[10px] font-black uppercase text-gray-900 mb-1">Guests</p>
                            <select
                              name="guests"
                              value={enquiryData.guests}
                              onChange={handleEnquiryChange}
                              className="w-full text-sm font-medium text-gray-900 bg-transparent focus:outline-none cursor-pointer appearance-none"
                            >
                              {[...Array(property.max_guests || 10)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'guest' : 'guests'}</option>
                              ))}
                            </select>
                          </div>
                          <ChevronRight className="rotate-90 text-gray-400 pointer-events-none" size={16} />
                        </div>
                      </div>
                      <div className="p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="w-full">
                            <p className="text-[10px] font-black uppercase text-gray-900 mb-1">Purpose</p>
                            <select
                              name="purpose"
                              value={enquiryData.purpose}
                              onChange={handleEnquiryChange}
                              className={`w-full text-sm font-medium bg-transparent focus:outline-none cursor-pointer appearance-none ${!enquiryData.purpose ? 'text-gray-400' : 'text-gray-900'}`}
                            >
                              <option value="" disabled>Select...</option>
                              <option value="Vacation">Vacation</option>
                              <option value="Business">Business</option>
                              <option value="Event">Event / Celebration</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <ChevronRight className="rotate-90 text-gray-400 pointer-events-none" size={16} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {enquiryStatus === 'error' && (
                    <p className="text-red-500 text-xs font-bold mb-4 flex items-center gap-1">
                      <AlertCircle size={14} /> {enquiryError}
                    </p>
                  )}

                  <button
                    onClick={submitEnquiry}
                    disabled={enquiryLoading}
                    className="w-full py-4 bg-[#EC5B13] hover:bg-[#d44f0f] text-white rounded-xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] mb-4 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {enquiryLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Processing...
                      </>
                    ) : "Inquire Now"}
                  </button>

                  <p className="text-center text-gray-500 text-xs font-semibold mb-6">You won't be charged yet</p>

                  <div className="pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-500 hover:text-black transition-colors cursor-pointer text-xs font-bold underline uppercase tracking-widest">
                    <MapPin size={14} />
                    Report this listing
                  </div>
                </>
              )}
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

        {/* Where you'll be Section */}
        <div className="mt-20 pt-16 border-t border-gray-100">
          <div className="mb-1">
            <h2 className="text-2xl font-serif text-gray-900 leading-tight">Where you'll be</h2>
          </div>
          <p className="text-gray-500 font-medium mb-8 text-sm">
            {property.city}, {property.state}, India
          </p>
          
          <div className="h-[480px] w-full bg-gray-100 rounded-[32px] overflow-hidden border border-gray-100 shadow-inner relative">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{
                  lat: property.latitude || 15.2993,
                  lng: property.longitude || 74.1240
                }}
                zoom={14}
                options={{
                  disableDefaultUI: false,
                  mapTypeControl: false,
                  streetViewControl: false,
                  fullscreenControl: true,
                  gestureHandling: 'cooperative',
                }}
              >
                <Marker 
                  position={{
                    lat: property.latitude || 15.2993,
                    lng: property.longitude || 74.1240
                  }} 
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#EC5B13" stroke="#EC5B13" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3" fill="white"/></svg>')
                  }}
                />
              </GoogleMap>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#EC5B13] border-t-transparent"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
