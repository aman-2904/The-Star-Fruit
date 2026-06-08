import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PropertyDetailsClient from "./PropertyDetailsClient";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!supabase) {
    return {
      title: "Property Details | LuxeVillaz",
    };
  }

  const { data: property, error } = await supabase
    .from('properties')
    .select('listing_title, listing_description')
    .eq('id', id)
    .single();

  if (error || !property) {
    return {
      title: "Property Not Found | LuxeVillaz",
    };
  }

  return {
    title: `${property.listing_title} | LuxeVillaz`,
    description: property.listing_description,
  };
}

export default async function PropertyDetailsPage({ params }: { params: Params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  if (!supabase) {
    notFound();
  }

  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !property) {
    notFound();
  }

  return <PropertyDetailsClient initialProperty={property} />;
}
