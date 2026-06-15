import { NextResponse } from "next/server";
import crypto from "crypto";

function hashData(data: string) {
  return crypto.createHash("sha256").update(data.trim().toLowerCase()).digest("hex");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { eventName, eventId, userData, customData } = body;

    const pixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
    const capiToken = process.env.FB_CAPI_TOKEN;

    if (!pixelId || !capiToken) {
      console.error("Facebook tracking parameters are missing.");
      return NextResponse.json({ error: "Tracking configuration missing" }, { status: 400 });
    }

    const payload = {
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
  } catch (error: any) {
    console.error("Error sending CAPI event:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
