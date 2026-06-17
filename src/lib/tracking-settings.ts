let cachedSettings: { pixel_enabled: boolean; capi_enabled: boolean } | null = null;
let settingsPromise: Promise<{ pixel_enabled: boolean; capi_enabled: boolean }> | null = null;

export async function getTrackingSettings(): Promise<{ pixel_enabled: boolean; capi_enabled: boolean }> {
  if (typeof window === "undefined") {
    // Return defaults on the server
    return { pixel_enabled: true, capi_enabled: true };
  }

  if (cachedSettings) return cachedSettings;
  if (settingsPromise) return settingsPromise;

  settingsPromise = fetch('/api/settings')
    .then(res => res.json())
    .then(data => {
      cachedSettings = {
        pixel_enabled: typeof data.pixel_enabled === 'boolean' ? data.pixel_enabled : true,
        capi_enabled: typeof data.capi_enabled === 'boolean' ? data.capi_enabled : true,
      };
      return cachedSettings;
    })
    .catch((err) => {
      console.warn("Failed to fetch tracking settings, defaulting to enabled:", err);
      cachedSettings = { pixel_enabled: true, capi_enabled: true };
      return cachedSettings;
    });

  return settingsPromise;
}

// Reset cache function for the admin panel when settings are updated
export function clearSettingsCache() {
  cachedSettings = null;
  settingsPromise = null;
}
