import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import FacebookPixelTracker from "@/components/FacebookPixelTracker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LuxeVillaz",
  description: "Stays you trust, Flexibility you'll love",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KM3XW6WR');
            `,
          }}
        />
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.luxevillaz.com/#organization",
                  "name": "Luxevillaz",
                  "url": "https://www.luxevillaz.com",
                  "logo": {
                    "@type": "ImageObject",
                    "@id": "https://www.luxevillaz.com/#logo",
                    "url": "https://www.luxevillaz.com/images/blogo.png",
                    "caption": "Luxevillaz Logo"
                  },
                  "description": "Discover exclusive luxury villas, apartments, stays, resorts, and cruises in Goa."
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.luxevillaz.com/#website",
                  "url": "https://www.luxevillaz.com",
                  "name": "Luxevillaz",
                  "publisher": {
                    "@id": "https://www.luxevillaz.com/#organization"
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.luxevillaz.com/stays?query={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-white text-gray-900`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KM3XW6WR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=1767920130876116&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <FacebookPixelTracker />
        {children}
      </body>
    </html>
  );
}
