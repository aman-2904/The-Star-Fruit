import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You | Luxevillaz",
  description: "Thank you for your inquiry. Our team will contact you shortly regarding your stay request.",
  metadataBase: new URL("https://www.luxevillaz.com"),
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Thank You | Luxevillaz",
    description: "Thank you for your inquiry. Our team will contact you shortly regarding your stay request.",
    url: "https://www.luxevillaz.com/thankyou",
    type: "website",
  },
};

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
