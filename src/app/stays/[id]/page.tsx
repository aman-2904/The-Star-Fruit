import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PropertyDetailsClient from "./PropertyDetailsClient";
import { slugify } from "@/utils/seo";

type Params = Promise<{ id: string }>;

const getRealId = (id: string): string => {
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const match = id.match(uuidRegex);
  return match ? match[0] : id;
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolvedParams = await params;
  const realId = getRealId(resolvedParams.id);

  if (!supabase) {
    return {
      title: "Property Details | LuxeVillaz",
    };
  }

  const { data: property, error } = await supabase
    .from('properties')
    .select('listing_title, listing_description, city, state, category, images')
    .eq('id', realId)
    .single();

  if (error || !property) {
    return {
      title: "Property Not Found | LuxeVillaz",
    };
  }

  const desc = property.listing_description || "";
  const shortDesc = desc.length > 100 ? desc.slice(0, 100) + "..." : desc;
  const metaDescription = `Book ${property.listing_title} from Luxevillaz, the best property in ${property.state || ""}, ${property.city || ""}.\n${shortDesc}`;

  const title = property.listing_title || "";
  const city = property.city || "";
  const category = property.category || "";

  const keywords = [
    title,
    city ? `${title} ${city}` : "",
    city ? `${title}, ${city}` : "",
    `${title} Booking`,
    `${title} Deals`,
    `${title} Reviews`,
    `${title} Photos`,
    `Book ${title}`,
    category ? `${category} Deals` : "",
    category ? `${category} Booking` : "",
    category && city ? `Luxury ${category} in ${city}` : "",
    category && city ? `Best ${category} in ${city}` : ""
  ].filter(Boolean);

  const firstImage = property.images && property.images.length > 0 ? property.images[0] : null;

  return {
    title: `${property.listing_title} | LuxeVillaz`,
    description: metaDescription,
    keywords,
    alternates: {
      canonical: `https://www.luxevillaz.com/stays/${slugify(title)}-${realId}`,
    },
    openGraph: {
      title: `${property.listing_title} | LuxeVillaz`,
      description: metaDescription,
      url: `https://www.luxevillaz.com/stays/${slugify(title)}-${realId}`,
      type: "website",
      images: firstImage ? [{ url: firstImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${property.listing_title} | LuxeVillaz`,
      description: metaDescription,
      images: firstImage ? [firstImage] : [],
    },
  };
}

export default async function PropertyDetailsPage({ params }: { params: Params }) {
  const resolvedParams = await params;
  const realId = getRealId(resolvedParams.id);

  if (!supabase) {
    notFound();
  }

  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', realId)
    .single();

  if (error || !property) {
    notFound();
  }

  return <PropertyDetailsClient initialProperty={property} />;
}
