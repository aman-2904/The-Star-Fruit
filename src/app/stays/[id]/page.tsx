import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PropertyDetailsClient from "./PropertyDetailsClient";

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
    .select('listing_title, listing_description, city, state')
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

  return {
    title: `${property.listing_title} | LuxeVillaz`,
    description: metaDescription,
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
