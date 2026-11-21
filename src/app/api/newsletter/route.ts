import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const supabase = createAdminClient();

    // 1. Check if already subscribed in Supabase
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, is_active")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        message: "You are already subscribed to the FAB BASIC Gazette.",
      });
    }

    // 2. Insert into Supabase
    let brevoSynced = false;
    const { error: dbError } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email: cleanEmail, is_active: true, brevo_synced: false }]);

    if (dbError) {
      console.error("DB Insert subscriber error:", dbError);
    }

    // 3. Sync to Brevo if API key is configured
    const brevoKey = process.env.BREVO_API_KEY;
    if (brevoKey && !brevoKey.includes("placeholder")) {
      try {
        const brevoRes = await fetch("https://api.brevo.com/v3/contacts", {
          method: "POST",
          headers: {
            "api-key": brevoKey,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: cleanEmail,
            updateEnabled: true,
          }),
        });

        if (brevoRes.ok || brevoRes.status === 201 || brevoRes.status === 204) {
          brevoSynced = true;
          await supabase
            .from("newsletter_subscribers")
            .update({ brevo_synced: true })
            .eq("email", cleanEmail);
        }
      } catch (brevoErr) {
        console.error("Brevo sync error:", brevoErr);
      }
    }

    return NextResponse.json({
      message: "Welcome to the FAB BASIC Gazette. You have been successfully subscribed.",
      brevoSynced,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
