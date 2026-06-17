import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  if (!supabase) {
    return NextResponse.json({ pixel_enabled: true, capi_enabled: true, table_exists: false });
  }

  try {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('value')
      .eq('key', 'facebook_tracking')
      .maybeSingle();

    if (error) {
      // Catch when the table or relation is missing
      console.warn("Could not retrieve tracking settings from database:", error.message);
      return NextResponse.json({ 
        pixel_enabled: true, 
        capi_enabled: true, 
        table_exists: false,
        error: error.message 
      });
    }

    if (data && data.value) {
      return NextResponse.json({
        pixel_enabled: typeof data.value.pixel_enabled === 'boolean' ? data.value.pixel_enabled : true,
        capi_enabled: typeof data.value.capi_enabled === 'boolean' ? data.value.capi_enabled : true,
        table_exists: true
      });
    }

    // Default configuration if the record isn't in the database yet
    return NextResponse.json({ pixel_enabled: true, capi_enabled: true, table_exists: true });
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    console.error("GET settings error:", errorMsg);
    return NextResponse.json({ pixel_enabled: true, capi_enabled: true, table_exists: false, error: errorMsg });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });

    const body = await req.json();
    const { pixel_enabled, capi_enabled } = body;

    const { error } = await supabaseClient
      .from('platform_settings')
      .upsert({
        key: 'facebook_tracking',
        value: { pixel_enabled, capi_enabled },
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      console.error("POST settings upsert error:", error.message);
      return NextResponse.json({ error: error.message, table_exists: false }, { status: 400 });
    }

    return NextResponse.json({ success: true, pixel_enabled, capi_enabled });
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    console.error("POST settings catch error:", errorMsg);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
