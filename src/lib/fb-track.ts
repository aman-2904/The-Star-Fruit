export const trackCompleteRegistration = (email: string, fullName: string, role: string) => {
  // Generate unique Event ID for deduplication
  const eventId = `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 1. Client-Side tracking (Pixel)
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq('track', 'CompleteRegistration', {
      content_name: 'User Registration',
      status: 'completed'
    }, { eventID: eventId });
  }

  // 2. Server-Side tracking (CAPI)
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
};

export const trackSearch = (searchString: string, category: string, checkIn?: string, checkOut?: string, guests?: string) => {
  // Generate unique Event ID for deduplication
  const eventId = `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // 1. Client-Side tracking (Pixel)
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq('track', 'Search', {
      search_string: searchString,
      content_category: category,
      check_in: checkIn || undefined,
      check_out: checkOut || undefined,
      guests: guests || undefined
    }, { eventID: eventId });
  }

  // 2. Server-Side tracking (CAPI)
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
};
