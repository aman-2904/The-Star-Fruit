import { Metadata } from "next";
import HostDashboardClient from "./HostDashboardClient";

export const metadata: Metadata = {
  title: "Become a Host on Luxevillaz | List Your Property & Earn More",
  description: "List your villa, apartment, stay, resort, cruise, or vacation rental on Luxevillaz. Reach more travelers, increase bookings, and maximize your rental income with our trusted hosting platform.",
  metadataBase: new URL("https://www.luxevillaz.com"),
  openGraph: {
    title: "Become a Host on Luxevillaz | List Your Property & Earn More",
    description: "List your villa, apartment, stay, resort, cruise, or vacation rental on Luxevillaz. Reach more travelers, increase bookings, and maximize your rental income with our trusted hosting platform.",
    url: "https://www.luxevillaz.com/host",
    type: "website",
    images: [
      {
        url: "/images/hero_bg_v2.jpg",
        width: 1200,
        height: 630,
        alt: "Become a Host on Luxevillaz",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Become a Host on Luxevillaz | List Your Property & Earn More",
    description: "List your villa, apartment, stay, resort, cruise, or vacation rental on Luxevillaz. Reach more travelers, increase bookings, and maximize your rental income with our trusted hosting platform.",
    images: ["/images/hostCTA.jpg"],
  },
};

export default function HostPage() {
  return <HostDashboardClient />;
}
