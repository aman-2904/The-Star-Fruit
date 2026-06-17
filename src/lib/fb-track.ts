import { getTrackingSettings } from "./tracking-settings";

interface CustomWindow extends Window {
  fbq?: (...args: unknown[]) => void;
}

export const trackCompleteRegistration = async (email: string, fullName: string, role: string) => {
  const settings = await getTrackingSettings();
  // Generate unique Event ID for deduplication
  const eventId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 1. Client-Side tracking (Pixel)
  if (settings.pixel_enabled && typeof window !== "undefined") {
    const w = window as unknown as CustomWindow;
    if (w.fbq) {
      w.fbq('track', 'CompleteRegistration', {
        content_name: 'User Registration',
        status: 'completed'
      }, { eventID: eventId });
    }
  }

  // 2. Server-Side tracking (CAPI)
  if (settings.capi_enabled) {
    fetch('/api/facebook-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'CompleteRegistration',
        eventId: eventId,
        userData: {
          email: email
        },
        customData: {
          content_name: 'User Registration',
          status: 'completed',
          user_role: role,
          full_name: fullName
        }
      })
    }).catch(err => console.error("CAPI CompleteRegistration failed:", err));
  }
};

export const trackSearch = async (searchString: string, category: string, checkIn?: string, checkOut?: string, guests?: string) => {
  const settings = await getTrackingSettings();
  // Generate unique Event ID for deduplication
  const eventId = `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 1. Client-Side tracking (Pixel)
  if (settings.pixel_enabled && typeof window !== "undefined") {
    const w = window as unknown as CustomWindow;
    if (w.fbq) {
      w.fbq('track', 'Search', {
        search_string: searchString,
        content_category: category,
        check_in: checkIn || undefined,
        check_out: checkOut || undefined,
        guests: guests || undefined
      }, { eventID: eventId });
    }
  }

  // 2. Server-Side tracking (CAPI)
  if (settings.capi_enabled) {
    fetch('/api/facebook-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: 'Search',
        eventId: eventId,
        userData: {},
        customData: {
          search_string: searchString,
          content_category: category,
          check_in: checkIn || undefined,
          check_out: checkOut || undefined,
          guests: guests || undefined
        }
      })
    }).catch(err => console.error("CAPI Search failed:", err));
  }
};
