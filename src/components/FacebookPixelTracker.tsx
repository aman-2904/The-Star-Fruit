"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getTrackingSettings } from "@/lib/tracking-settings";

interface CustomWindow extends Window {
  fbq?: (...args: unknown[]) => void;
}

function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
    if (!pixelId) return;

    // Generate unique Event ID for deduplication
    const eventId = `pageview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const runTracking = async () => {
      try {
        const settings = await getTrackingSettings();

        // 1. Client-Side tracking (Pixel)
        if (settings.pixel_enabled) {
          let retries = 0;
          const sendPixelEvent = () => {
            if (typeof window !== "undefined") {
              const w = window as unknown as CustomWindow;
              if (w.fbq) {
                w.fbq('track', 'PageView', {}, { eventID: eventId });
              } else if (retries < 20) {
                retries++;
                setTimeout(sendPixelEvent, 100);
              }
            }
          };
          sendPixelEvent();
        }

        // 2. Server-Side tracking (CAPI)
        if (settings.capi_enabled) {
          fetch('/api/facebook-capi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              eventName: 'PageView',
              eventId: eventId,
              userData: {}, // CAPI endpoint will dynamically capture User-Agent and Client IP from request headers
              customData: {
                event_source: "website",
                page_path: pathname,
              }
            })
          }).catch(err => console.error("CAPI PageView failed:", err));
        }
      } catch (err) {
        console.error("Facebook tracking settings load error:", err);
      }
    };

    runTracking();
  }, [pathname, searchParams]);

  return null;
}

export default function FacebookPixelTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
