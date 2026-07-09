import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LuxeVillas Goa Blog | Discover the Best Villas in Goa",
  description: "Explore the Villas Goa Blog for expert travel tips, luxury villa recommendations, booking advice, and insider guides to make your Goa vacation unforgettable.",
  metadataBase: new URL("https://www.luxevillaz.com"),
  keywords: [
    "best villa in goa",
    "pool site villa in goa",
    "private blogs",
    "special villa for couple in goa",
    "best hotel in goa"
  ],
  alternates: {
    canonical: "https://www.luxevillaz.com/blogs",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "LuxeVillas Goa Blog | Discover the Best Villas in Goa",
    description: "Explore the Villas Goa Blog for expert travel tips, luxury villa recommendations, booking advice, and insider guides to make your Goa vacation unforgettable.",
    url: "https://www.luxevillaz.com/blogs",
    type: "website",
    images: [
      {
        url: "/images/hero_bg.webp",
        width: 1200,
        height: 630,
        alt: "Villas Goa Blog",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Villas Goa Blog | Discover the Best Villas in Goa",
    description: "Explore the Villas Goa Blog for expert travel tips, luxury villa recommendations, booking advice, and insider guides to make your Goa vacation unforgettable.",
    images: ["/images/hero_bg.webp"],
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
