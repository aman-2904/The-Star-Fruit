import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

function hashData(data: string) {
  return crypto.createHash("sha256").update(data.trim().toLowerCase()).digest("hex");
}

export async function POST(req: Request) {
  try {
    // Check if CAPI is enabled in the database settings
    if (supabase) {
      const { data: settingsData } = await supabase
        .from('platform_settings')
        .select('value')
        .eq('key', 'facebook_tracking')
        .maybeSingle();

      if (settingsData && settingsData.value && settingsData.value.capi_enabled === false) {
        return NextResponse.json({ message: "Conversion API is disabled by administrator." });
      }
    }

    const body = await req.json();
    const { eventName, eventId, userData, customData } = body;

    const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
    const capiToken = process.env.FB_CAPI_TOKEN;

    if (!pixelId || !capiToken) {
      console.error("Facebook tracking parameters are missing.");
      return NextResponse.json({ error: "Tracking configuration missing" }, { status: 400 });
    }

    interface FacebookEventPayload {
      data: Array<{
        event_name: string;
        event_time: number;
        event_id: string;
        event_source: string;
        action_source: string;
        user_data: {
          em?: string[];
          ph?: string[];
          client_ip_address?: string;
          client_user_agent?: string;
        };
        custom_data: Record<string, unknown>;
      }>;
      test_event_code?: string;
    }

    const payload: FacebookEventPayload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source: "website",
          action_source: "website",
          user_data: {
            em: userData.email ? [hashData(userData.email)] : undefined,
            ph: userData.phone ? [hashData(userData.phone)] : undefined,
            client_ip_address: req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || undefined,
            client_user_agent: req.headers.get("user-agent") || undefined,
          },
          custom_data: customData,
        },
      ],
    };

    if (process.env.FB_TEST_EVENT_CODE) {
      payload.test_event_code = process.env.FB_TEST_EVENT_CODE;
    }

    const fbResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${capiToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await fbResponse.json();
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error sending CAPI event:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
