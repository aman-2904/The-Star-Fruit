import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to Luxevillaz | Access Your Account",
  description: "Discover luxury villas, apartments, stays, resorts, and cruises on Luxevillaz. Find the perfect getaway, compare options, and book unforgettable travel experiences with ease.",
  metadataBase: new URL("https://www.luxevillaz.com"),
  openGraph: {
    title: "Login to Luxevillaz | Access Your Account",
    description: "Discover luxury villas, apartments, stays, resorts, and cruises on Luxevillaz. Find the perfect getaway, compare options, and book unforgettable travel experiences with ease.",
    url: "https://www.luxevillaz.com/login",
    type: "website",
    images: [
      {
        url: "/images/contact_bg.png",
        width: 1200,
        height: 630,
        alt: "Login to Luxevillaz",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Login to Luxevillaz | Access Your Account",
    description: "Discover luxury villas, apartments, stays, resorts, and cruises on Luxevillaz. Find the perfect getaway, compare options, and book unforgettable travel experiences with ease.",
    images: ["/images/contact_bg.png"],
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
