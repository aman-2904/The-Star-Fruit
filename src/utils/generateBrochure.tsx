"use client";

import React from "react";
import { createRoot } from "react-dom/client";
import { Property } from "@/app/stays/[id]/PropertyDetailsClient";

// Convert an image URL to a Base64 Data URL to avoid CORS and caching issues
export const fetchImageAsBase64 = async (url: string): Promise<string> => {
  if (!url) return "";
  if (url.startsWith("data:")) return url;

  try {
    const response = await fetch(url, { cache: "no-cache" });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read image blob"));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error prefetching image:", error, url);
    // If relative path, try absolute URL
    if (url.startsWith("/")) {
      try {
        const absUrl = window.location.origin + url;
        const response = await fetch(absUrl, { cache: "no-cache" });
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Failed to read absolute image"));
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.error("Failed absolute image fetch fallback:", err);
      }
    }
    // Return a stylish inline SVG fallback if all fails
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%231E2026"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="18" fill="%23c5a880">LuxeVillaz Premium Stay</text></svg>`;
  }
};

// SVG divider ornament
const GoldOrnament = () => (
  <div className="flex items-center justify-center gap-4 my-3">
    <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-[#B4975A]" />
    <span className="text-[#B4975A] text-xs font-serif">◆</span>
    <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-[#B4975A]" />
  </div>
);

// Dynamic Google Fonts Loader
const loadGoogleFont = () => {
  const fontId = "google-font-brochure";
  if (typeof document !== "undefined" && !document.getElementById(fontId)) {
    const link = document.createElement("link");
    link.id = fontId;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }
};

interface BrochureTemplateProps {
  property: Property;
  base64Images: {
    logoFooter: string;
    logoBlogo: string;
    cover: string;
    gallery: string[];
    map: string;
    qr: string;
  };
  pageUrl: string;
}

export const BrochureTemplate: React.FC<BrochureTemplateProps> = ({
  property,
  base64Images,
  pageUrl,
}) => {
  const { cover, gallery, map, qr, logoFooter, logoBlogo } = base64Images;

  // Pre-process and dynamically split description to prevent A4 page overflow while keeping full text
  const rawDescription = property.listing_description || property.description || "Welcome to our stunning property. This luxury space offers an unparalleled blend of modern architecture and tropical charm, meticulously designed to cater to your every comfort.";
  
  // A description is considered long if it exceeds 500 characters or contains more than 8 lines
  const isDescriptionLong = rawDescription.length > 500 || rawDescription.split("\n").length > 8;

  const descriptionPages: string[] = [];
  if (isDescriptionLong) {
    const paragraphs = rawDescription.split("\n");
    let currentChunk = "";
    let lineCount = 0;
    
    paragraphs.forEach((line) => {
      // Estimate lines needed (assuming ~90 characters per line on A4 width)
      const linesNeeded = Math.max(1, Math.ceil(line.length / 90));
      
      // A dedicated description page can comfortably fit ~38 lines of text
      if (lineCount + linesNeeded > 38) {
        descriptionPages.push(currentChunk.trim());
        currentChunk = line + "\n";
        lineCount = linesNeeded;
      } else {
        currentChunk += line + "\n";
        lineCount += linesNeeded;
      }
    });
    if (currentChunk.trim()) {
      descriptionPages.push(currentChunk.trim());
    }
  }

  // Determine rules
  const allowsSmoking = property.house_rules?.smoking === true;
  const allowsPets =
    property.house_rules?.pets === true ||
    property.house_rules?.pets_allowed === true ||
    property.house_rules?.no_pets === false;
  const allowsParties = property.house_rules?.parties === true || property.house_rules?.parties_allowed === true;

  // Setup gallery images
  const gImg1 = gallery[0] || cover;
  const gImg2 = gallery[1] || cover;
  const gImg3 = gallery[2] || cover;
  const gImg4 = gallery[3] || cover;
  const gImg5 = gallery[4] || cover;

  // Extra images grid rendering (if more than 5 gallery images exist)
  const extraImages = gallery.slice(5);
  const extraPages: string[][] = [];
  for (let i = 0; i < extraImages.length; i += 6) {
    extraPages.push(extraImages.slice(i, i + 6));
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="text-gray-800">
      {/* ==================== PAGE 1: COVER ==================== */}
      <div className="brochure-page w-[794px] h-[1123px] bg-[#090b0e] text-white flex flex-col justify-between p-12 relative overflow-hidden box-border">
        {/* Branding header */}
        <div className="text-center pt-2">
          {logoFooter ? (
            <img src={logoFooter} alt="LuxeVillaz Logo" className="h-10 w-auto object-contain mx-auto" />
          ) : (
            <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-[#B4975A]">LUXE VILLAZ</h2>
          )}
          <p className="text-[8px] tracking-[0.4em] uppercase text-gray-500 mt-1 font-semibold">Experience Luxury</p>
        </div>

        {/* Cover Photo card */}
        <div className="relative w-[700px] h-[520px] rounded-[24px] overflow-hidden mx-auto border border-[#B4975A]/15 shadow-2xl">
          <img src={cover} alt={property.listing_title} className="w-full h-full object-cover" />
          
          {/* Overlay info box */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8 pt-20">
            <h1 className="text-4xl font-serif font-normal text-white mb-2 tracking-wide capitalize leading-tight">
              {property.listing_title}
            </h1>
            <p className="text-gray-300 text-sm font-medium tracking-wider mb-6 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              {property.city}, {property.state}, India
            </p>

            {/* Accent Badges */}
            <div className="grid grid-cols-4 gap-3 border-t border-white/10 pt-5">
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full border border-[#B4975A]/30 flex items-center justify-center mb-1.5 bg-black/40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <span className="text-[9px] font-bold text-gray-300 tracking-wider uppercase truncate w-full">Entire {property.category}</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full border border-[#B4975A]/30 flex items-center justify-center mb-1.5 bg-black/40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <span className="text-[9px] font-bold text-gray-300 tracking-wider uppercase">Superhost</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full border border-[#B4975A]/30 flex items-center justify-center mb-1.5 bg-black/40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="6" cy="8" r="2"/><circle cx="13" cy="10" r="2"/><path d="M12 20c-2 0-3.5-1.5-3.5-3.5 0-1 1-2 2-2h3c1 0 2 1 2 2 0 2-1.5 3.5-3.5 3.5z"/></svg>
                </div>
                <span className="text-[9px] font-bold text-gray-300 tracking-wider uppercase truncate w-full">{allowsPets ? "Pet Friendly" : "Luxury Stay"}</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full border border-[#B4975A]/30 flex items-center justify-center mb-1.5 bg-black/40">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.886L4.2 9.176l5.068 3.845L7.356 19 12 15.228 16.644 19l-1.912-5.979 5.068-3.845-5.888-.29L12 3z"/></svg>
                </div>
                <span className="text-[9px] font-bold text-gray-300 tracking-wider uppercase">Premium stay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Short welcome description */}
        <div className="text-center px-12 mb-4">
          <p className="text-gray-400 text-sm leading-relaxed font-medium">
            Welcome to {property.listing_title} by LuxeVillaz, a refined retreat blending Spanish-Portuguese charm with modern luxury. Perfect for families and groups looking for a premium stay in {property.city}.
          </p>
          <GoldOrnament />
        </div>
      </div>

      {/* ==================== PAGE 2: PROPERTY DETAILS & GALLERY ==================== */}
      <div className="brochure-page w-[794px] h-[1123px] bg-[#FCFBF9] text-gray-800 flex flex-col justify-between p-12 relative overflow-hidden box-border">
        {/* Section: Property Details */}
        <div className="flex-1 flex flex-col justify-start">
          <div className="text-center pt-2">
            <h2 className="font-serif text-sm font-bold tracking-[0.2em] text-[#B4975A] uppercase">PROPERTY DETAILS</h2>
            <GoldOrnament />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white border border-[#B4975A]/15 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="1.5" className="mb-2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span className="text-xs font-bold text-gray-900">{property.max_guests} Guests</span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">Capacity</span>
            </div>
            <div className="bg-white border border-[#B4975A]/15 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="1.5" className="mb-2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><circle cx="6" cy="12" r="2"/><circle cx="14" cy="12" r="2"/></svg>
              <span className="text-xs font-bold text-gray-900">{property.bedrooms} Bedrooms</span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">Rooms</span>
            </div>
            <div className="bg-white border border-[#B4975A]/15 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="1.5" className="mb-2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h12"/><path d="M6 12h12"/><path d="M6 16h12"/></svg>
              <span className="text-xs font-bold text-gray-900">{property.beds} Beds</span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">Sleeping</span>
            </div>
            <div className="bg-white border border-[#B4975A]/15 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="1.5" className="mb-2"><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-2.12 0l-.88.88a1.5 1.5 0 0 0 0 2.12L6 9"/><path d="M2 16h20"/><path d="M4 12a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3H4Z"/><path d="m5 16-.5 3.5A1.5 1.5 0 0 0 6 21h12a1.5 1.5 0 0 0 1.5-1.5L19 16"/></svg>
              <span className="text-xs font-bold text-gray-900">{property.bathrooms} Bathrooms</span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">Baths</span>
            </div>
            <div className="bg-white border border-[#B4975A]/15 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="1.5" className="mb-2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              <span className="text-xs font-bold text-gray-900 capitalize">{property.category}</span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">Property Type</span>
            </div>
            <div className="bg-white border border-[#B4975A]/15 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="1.5" className="mb-2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span className="text-xs font-bold text-gray-900">2:00 PM / 11:00 AM</span>
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">In / Out Times</span>
            </div>
          </div>
        </div>

        {/* Section: Gallery */}
        <div className="flex-1 flex flex-col justify-start mt-8">
          <div className="text-center">
            <h2 className="font-serif text-sm font-bold tracking-[0.2em] text-[#B4975A] uppercase">GALLERY</h2>
            <GoldOrnament />
          </div>

          <div className="grid grid-cols-12 gap-3 h-[380px] w-full mt-4">
            <div className="col-span-7 h-full rounded-2xl overflow-hidden shadow-md">
              <img src={gImg1} alt="Gallery 1" className="w-full h-full object-cover" />
            </div>
            <div className="col-span-5 grid grid-cols-2 grid-rows-2 gap-2.5 h-full">
              <div className="h-full rounded-xl overflow-hidden shadow-sm">
                <img src={gImg2} alt="Gallery 2" className="w-full h-full object-cover" />
              </div>
              <div className="h-full rounded-xl overflow-hidden shadow-sm">
                <img src={gImg3} alt="Gallery 3" className="w-full h-full object-cover" />
              </div>
              <div className="h-full rounded-xl overflow-hidden shadow-sm">
                <img src={gImg4} alt="Gallery 4" className="w-full h-full object-cover" />
              </div>
              <div className="h-full rounded-xl overflow-hidden shadow-sm">
                <img src={gImg5} alt="Gallery 5" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Subtle spacing footer */}
        <div className="pt-8 text-center text-[9px] font-bold text-gray-400 tracking-widest uppercase">
          LUXE VILLAZ PROPERTIES
        </div>
      </div>

      {/* ==================== PAGE 3 (CASE A): COMBINED ABOUT & AMENITIES ==================== */}
      {!isDescriptionLong && (
        <div className="brochure-page w-[794px] h-[1123px] bg-[#FCFBF9] text-gray-800 flex flex-col justify-between p-12 relative overflow-hidden box-border">
          {/* Section: About the property */}
          <div className="flex-1 flex flex-col justify-start">
            <div className="text-center pt-2">
              <h2 className="font-serif text-sm font-bold tracking-[0.2em] text-[#B4975A] uppercase">ABOUT THE PROPERTY</h2>
              <GoldOrnament />
            </div>

            <div className="mt-4 px-4">
              <p className="text-gray-600 text-sm leading-relaxed text-justify whitespace-pre-line font-medium">
                {rawDescription}
              </p>
            </div>

            {/* Taglines block */}
            <div className="grid grid-cols-4 gap-4 mt-8 px-4">
              <div className="border border-[#B4975A]/20 bg-[#FAF9F5] rounded-xl py-3 px-2 flex flex-col items-center text-center">
                <span className="text-[#B4975A] text-lg mb-1">🌿</span>
                <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Peaceful Location</span>
              </div>
              <div className="border border-[#B4975A]/20 bg-[#FAF9F5] rounded-xl py-3 px-2 flex flex-col items-center text-center">
                <span className="text-[#B4975A] text-lg mb-1">🛎️</span>
                <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Premium Service</span>
              </div>
              <div className="border border-[#B4975A]/20 bg-[#FAF9F5] rounded-xl py-3 px-2 flex flex-col items-center text-center">
                <span className="text-[#B4975A] text-lg mb-1">✨</span>
                <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Luxury Comfort</span>
              </div>
              <div className="border border-[#B4975A]/20 bg-[#FAF9F5] rounded-xl py-3 px-2 flex flex-col items-center text-center">
                <span className="text-[#B4975A] text-lg mb-1">💝</span>
                <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Memorable Stay</span>
              </div>
            </div>
          </div>

          {/* Section: Amenities */}
          <div className="flex-1 flex flex-col justify-start mt-8">
            <div className="text-center">
              <h2 className="font-serif text-sm font-bold tracking-[0.2em] text-[#B4975A] uppercase">AMENITIES</h2>
              <GoldOrnament />
            </div>

            <div className="grid grid-cols-2 gap-y-3.5 gap-x-12 mt-6 px-12">
              {(property.amenities && property.amenities.length > 0
                ? property.amenities.slice(0, 16)
                : ["Private pool", "Air conditioning", "High speed Wifi", "Fully equipped kitchen", "Television", "Lawn/Garden", "Washing machine", "24/7 Security"]
              ).map((item, index) => (
                <div key={index} className="flex items-center gap-3 border-b border-gray-100 pb-1.5 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-xs font-semibold capitalize tracking-wide">{item.replace(/_/g, " ")}</span>
                </div>
              ))}
            </div>
            {property.amenities && property.amenities.length > 16 && (
              <p className="text-center text-[10px] font-bold text-[#B4975A] uppercase mt-4 tracking-widest">
                & {property.amenities.length - 16} More Amenities Available
              </p>
            )}
          </div>

          {/* Subtle spacing footer */}
          <div className="pt-8 text-center text-[9px] font-bold text-gray-400 tracking-widest uppercase">
            LUXE VILLAZ PROPERTIES
          </div>
        </div>
      )}

      {/* ==================== PAGE 3 (CASE B): DEDICATED ABOUT PAGES ==================== */}
      {isDescriptionLong && descriptionPages.map((descPageText, pageIdx) => (
        <div key={`about-page-${pageIdx}`} className="brochure-page w-[794px] h-[1123px] bg-[#FCFBF9] text-gray-800 flex flex-col justify-between p-12 relative overflow-hidden box-border">
          <div className="flex-1 flex flex-col justify-start">
            <div className="text-center pt-2">
              <h2 className="font-serif text-sm font-bold tracking-[0.2em] text-[#B4975A] uppercase">
                ABOUT THE PROPERTY
              </h2>
              <GoldOrnament />
            </div>

            <div className="mt-6 px-6">
              <p className="text-gray-600 text-[13px] leading-relaxed text-justify whitespace-pre-line font-medium">
                {descPageText}
              </p>
            </div>

            {/* Taglines block rendered only on the final description page */}
            {pageIdx === descriptionPages.length - 1 && (
              <div className="grid grid-cols-4 gap-4 mt-12 px-6">
                <div className="border border-[#B4975A]/20 bg-[#FAF9F5] rounded-xl py-3 px-2 flex flex-col items-center text-center">
                  <span className="text-[#B4975A] text-lg mb-1">🌿</span>
                  <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Peaceful Location</span>
                </div>
                <div className="border border-[#B4975A]/20 bg-[#FAF9F5] rounded-xl py-3 px-2 flex flex-col items-center text-center">
                  <span className="text-[#B4975A] text-lg mb-1">🛎️</span>
                  <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Premium Service</span>
                </div>
                <div className="border border-[#B4975A]/20 bg-[#FAF9F5] rounded-xl py-3 px-2 flex flex-col items-center text-center">
                  <span className="text-[#B4975A] text-lg mb-1">✨</span>
                  <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Luxury Comfort</span>
                </div>
                <div className="border border-[#B4975A]/20 bg-[#FAF9F5] rounded-xl py-3 px-2 flex flex-col items-center text-center">
                  <span className="text-[#B4975A] text-lg mb-1">💝</span>
                  <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Memorable Stay</span>
                </div>
              </div>
            )}
          </div>

          {/* Subtle spacing footer */}
          <div className="pt-8 text-center text-[9px] font-bold text-gray-400 tracking-widest uppercase">
            LUXE VILLAZ PROPERTIES
          </div>
        </div>
      ))}

      {/* ==================== PAGE 3 (CASE C): DEDICATED AMENITIES PAGE ==================== */}
      {isDescriptionLong && (
        <div className="brochure-page w-[794px] h-[1123px] bg-[#FCFBF9] text-gray-800 flex flex-col justify-between p-12 relative overflow-hidden box-border">
          <div className="flex-1 flex flex-col justify-start">
            <div className="text-center pt-2">
              <h2 className="font-serif text-sm font-bold tracking-[0.2em] text-[#B4975A] uppercase">AMENITIES</h2>
              <GoldOrnament />
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-12 mt-10 px-12">
              {(property.amenities && property.amenities.length > 0
                ? property.amenities.slice(0, 24)
                : ["Private pool", "Air conditioning", "High speed Wifi", "Fully equipped kitchen", "Television", "Lawn/Garden", "Washing machine", "24/7 Security"]
              ).map((item, index) => (
                <div key={index} className="flex items-center gap-3.5 border-b border-gray-100 pb-2 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-xs font-semibold capitalize tracking-wide">{item.replace(/_/g, " ")}</span>
                </div>
              ))}
            </div>
            {property.amenities && property.amenities.length > 24 && (
              <p className="text-center text-[10px] font-bold text-[#B4975A] uppercase mt-8 tracking-widest">
                & {property.amenities.length - 24} More Amenities Available
              </p>
            )}
          </div>

          {/* Subtle spacing footer */}
          <div className="pt-8 text-center text-[9px] font-bold text-gray-400 tracking-widest uppercase">
            LUXE VILLAZ PROPERTIES
          </div>
        </div>
      )}

      {/* ==================== PAGE 4: RULES, MAP & CONTACT ==================== */}
      <div className="brochure-page w-[794px] h-[1123px] bg-[#FCFBF9] text-gray-800 flex flex-col justify-between p-12 pb-0 relative overflow-hidden box-border">
        <div className="flex-1 flex flex-col justify-start">
          {/* House Rules Section - Full Width Card */}
          <div className="flex flex-col mt-2">
            <h3 className="font-serif text-sm font-bold tracking-[0.15em] text-[#B4975A] mb-3 uppercase text-center">HOUSE RULES</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 bg-white border border-[#B4975A]/15 rounded-2xl p-5 shadow-sm max-w-[700px] mx-auto w-full">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${allowsSmoking ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className="text-xs font-semibold text-gray-800">{allowsSmoking ? "Smoking Allowed" : "No Smoking"}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${allowsPets ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className="text-xs font-semibold text-gray-800">{allowsPets ? "Pets Allowed" : "No Pets Allowed"}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${allowsParties ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className="text-xs font-semibold text-gray-800">{allowsParties ? "Parties Allowed" : "No Parties / Events"}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold text-gray-800">Self Check-in Available</span>
              </div>
              <div className="flex items-center gap-3 col-span-2 justify-center border-t border-gray-100 pt-2.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs font-semibold text-gray-800">Quiet Hours: After 10:00 PM</span>
              </div>
            </div>
          </div>

          {/* Location Section - Full Width underneath */}
          <div className="flex flex-col mt-8">
            <h3 className="font-serif text-sm font-bold tracking-[0.15em] text-[#B4975A] mb-3 uppercase text-center">LOCATION</h3>
            <div className="w-full max-w-[700px] mx-auto">
              <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative bg-[#eeece6]">
                {map ? (
                  <img src={map} alt="Map" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <span className="text-2xl mb-1">📍</span>
                    <span className="text-xs font-bold text-gray-800 capitalize">{property.city}, {property.state}</span>
                    <span className="text-[10px] text-gray-400 mt-1">Google Static Map Unavailable</span>
                  </div>
                )}
              </div>
              <div className="mt-3 text-center px-4">
                <p className="text-[11px] font-bold text-gray-700 leading-normal flex items-center justify-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="2" className="shrink-0"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>{[property.street_address, property.city, property.state, "India"].filter(Boolean).join(", ")}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Us Card */}
        <div className="mt-4">
          <div className="text-center">
            <h2 className="font-serif text-sm font-bold tracking-[0.2em] text-[#B4975A] uppercase">CONTACT US</h2>
            <GoldOrnament />
          </div>

          <div className="bg-[#FAF9F5] border border-[#B4975A]/20 rounded-[20px] p-6 flex justify-between items-center shadow-sm max-w-[700px] mx-auto mt-3 mb-10">
            {/* Info details */}
            <div className="flex-1 flex flex-col justify-start">
              {logoBlogo ? (
                <img src={logoBlogo} alt="LuxeVillaz Logo" className="h-8 w-auto object-contain mr-auto mb-4" />
              ) : (
                <h3 className="text-base font-bold uppercase tracking-[0.25em] text-[#B4975A] mb-3">LUXE VILLAZ</h3>
              )}
              
              <div className="space-y-2 text-gray-600 font-semibold text-[11px]">
                <p className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  www.luxevillaz.com
                </p>
                <p className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  bookings@luxevillaz.com
                </p>
                <p className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B4975A" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  +91 98765 43210
                </p>
                <p className="flex items-center gap-2 text-emerald-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  24/7 Guest Concierge Support
                </p>
              </div>
            </div>

            {/* QR Scan box */}
            <div className="bg-[#F4F2EB] border border-[#B4975A]/15 rounded-xl p-3 flex flex-col items-center justify-center text-center w-[150px] shadow-sm shrink-0">
              <span className="text-[8px] font-bold text-gray-600 tracking-wider uppercase mb-1">SCAN TO BOOK YOUR STAY</span>
              {qr ? (
                <img src={qr} alt="Booking QR Code" className="w-[90px] h-[90px] object-contain rounded-lg border border-white" />
              ) : (
                <div className="w-[90px] h-[90px] bg-white flex items-center justify-center rounded-lg border border-gray-100">
                  <span className="text-[10px] text-gray-300">QR Code</span>
                </div>
              )}
              <span className="text-[8px] font-bold text-[#B4975A] tracking-wider mt-1">luxevillaz.com</span>
            </div>
          </div>
        </div>

        {/* Black Bottom Banner */}
        <div className="w-[794px] h-[55px] bg-[#090b0e] text-white flex items-center justify-between px-12 -mx-12 shrink-0">
          <span className="text-[9px] tracking-[0.25em] uppercase font-serif text-[#B4975A] font-semibold">
            Experience Luxury. Stay with LuxeVillaz.
          </span>
          <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">
            www.luxevillaz.com
          </span>
        </div>
      </div>

      {/* ==================== PAGE 5+: EXTRA GALLERY PAGES ==================== */}
      {extraPages.map((pageImgs, pageIdx) => (
        <div key={pageIdx} className="brochure-page w-[794px] h-[1123px] bg-[#FCFBF9] text-gray-800 flex flex-col justify-between p-12 pb-0 relative overflow-hidden box-border">
          {/* Header */}
          <div className="text-center pt-2">
            {logoBlogo ? (
              <img src={logoBlogo} alt="LuxeVillaz Logo" className="h-8 w-auto object-contain mx-auto" />
            ) : (
              <h2 className="text-lg font-bold uppercase tracking-[0.3em] text-[#B4975A]">LUXE VILLAZ</h2>
            )}
            <p className="text-[8px] tracking-[0.4em] uppercase text-gray-500 mt-1 font-semibold">ADDITIONAL GALLERY - Page {pageIdx + 1}</p>
            <GoldOrnament />
          </div>

          {/* Grid of extra images */}
          <div className="grid grid-cols-2 grid-rows-3 gap-4 mt-6 h-[800px] w-full px-4">
            {pageImgs.map((img, imgIdx) => (
              <div key={imgIdx} className="h-[250px] w-full rounded-2xl overflow-hidden shadow-md border border-[#B4975A]/10 bg-gray-50">
                <img src={img} alt={`Gallery Extra ${pageIdx * 6 + imgIdx + 6}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* Black Bottom Banner */}
          <div className="w-[794px] h-[55px] bg-[#090b0e] text-white flex items-center justify-between px-12 -mx-12 shrink-0 mt-8">
            <span className="text-[9px] tracking-[0.25em] uppercase font-serif text-[#B4975A] font-semibold">
              Experience Luxury. Stay with LuxeVillaz.
            </span>
            <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">
              www.luxevillaz.com
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

interface GenerateBrochureOptions {
  property: Property;
  pageUrl: string;
  onProgress?: (progress: number) => void;
}

export const generateBrochure = async ({
  property,
  pageUrl,
  onProgress,
}: GenerateBrochureOptions): Promise<void> => {
  // 1. Dynamic imports of html2canvas-pro and jspdf to avoid server-side build issues and Tailwind v4 lab() color parser crashes
  const [html2canvas, { jsPDF }] = await Promise.all([
    import("html2canvas-pro").then((m) => m.default),
    import("jspdf"),
  ]);

  // Load Google Fonts
  loadGoogleFont();
  if (onProgress) onProgress(10);

  // 2. Parallelize all image fetching to drastically reduce download times
  const allImages = property.images || [];
  const coverUrl = allImages[0] || "/images/stays/pool_villa.webp";
  const galleryUrls = allImages.slice(1, 13);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(pageUrl)}`;
  
  let mapUrl = "";
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const lat = property.latitude || 15.2993;
  const lng = property.longitude || 74.1240;
  if (mapsApiKey) {
    mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=640x320&scale=2&markers=color:0xEC5B13%7C${lat},${lng}&key=${mapsApiKey}`;
  }

  const totalImages = 5 + galleryUrls.length; // footer, blogo, cover, qr, map
  let fetchedCount = 0;

  const fetchWithProgress = async (url: string) => {
    if (!url) {
      fetchedCount++;
      return "";
    }
    try {
      const res = await fetchImageAsBase64(url);
      fetchedCount++;
      if (onProgress) {
        onProgress(10 + Math.round((fetchedCount / totalImages) * 70));
      }
      return res;
    } catch (e) {
      fetchedCount++;
      return "";
    }
  };

  const [
    logoFooterBase64,
    logoBlogoBase64,
    coverBase64,
    qrBase64,
    mapBase64,
    ...galleryBase64
  ] = await Promise.all([
    fetchWithProgress("/images/footerlogo.webp"),
    fetchWithProgress("/images/blogo.webp"),
    fetchWithProgress(coverUrl),
    fetchWithProgress(qrUrl),
    fetchWithProgress(mapUrl),
    ...galleryUrls.map(url => fetchWithProgress(url))
  ]);

  // Combine preloaded base64 resources
  const base64Images = {
    logoFooter: logoFooterBase64,
    logoBlogo: logoBlogoBase64,
    cover: coverBase64,
    gallery: galleryBase64,
    map: mapBase64,
    qr: qrBase64,
  };

  // 3. Create temporary hidden container in DOM
  const container = document.createElement("div");
  container.id = "pdf-brochure-container";
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = "794px"; // Exact A4 aspect ratio base width
  document.body.appendChild(container);

  // 4. Render React BrochureTemplate into container
  const root = createRoot(container);
  root.render(
    <BrochureTemplate
      property={property}
      base64Images={base64Images}
      pageUrl={pageUrl}
    />
  );

  // Wait a short delay to ensure React commits to DOM and font layout settles
  await new Promise((resolve) => setTimeout(resolve, 600));
  if (onProgress) onProgress(85);

  try {
    const pages = container.querySelectorAll(".brochure-page");
    if (pages.length === 0) {
      throw new Error("Brochure pages were not rendered in DOM");
    }

    // 5. Initialize PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pdfWidth = 595.28; // A4 width in pt
    const pdfHeight = 841.89; // A4 height in pt

    // 6. Draw each page to canvas and add to PDF
    for (let index = 0; index < pages.length; index++) {
      const pageEl = pages[index] as HTMLElement;
      
      const canvas = await html2canvas(pageEl, {
        scale: 2.0, // Reduced from 3.0 to 2.0 for faster rendering while retaining good quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0); // Maximum quality, no JPEG artifacts

      if (index > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight, undefined, "NONE");
      
      if (onProgress) {
        onProgress(85 + Math.round(((index + 1) / pages.length) * 12));
      }
    }

    // 7. Save PDF file
    const fileName = `${property.listing_title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_brochure.pdf`;
    pdf.save(fileName);
    
    if (onProgress) onProgress(100);
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Sorry, we encountered an issue generating your brochure. Please try again.");
  } finally {
    // 8. Clean up DOM and unmount React root
    root.unmount();
    document.body.removeChild(container);
  }
};
