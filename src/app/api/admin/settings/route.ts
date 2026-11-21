import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/utils/auth";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("fab_admin_session")?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let editorialFeature = null;
  if (data?.brand_story_image && typeof data.brand_story_image === "string" && data.brand_story_image.startsWith("{")) {
    try {
      editorialFeature = JSON.parse(data.brand_story_image);
    } catch (e) {
      console.error(e);
    }
  }

  return NextResponse.json({
    settings: {
      ...data,
      editorial_feature: editorialFeature,
    },
  });
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("fab_admin_session")?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updates = await request.json();
  const supabase = createAdminClient();

  // If editorial_feature is provided, store structured in brand_story_image
  if (updates.editorial_feature) {
    updates.brand_story_image = JSON.stringify(updates.editorial_feature);
    delete updates.editorial_feature;
  }

  const { data, error } = await supabase
    .from("store_settings")
    .upsert({
      id: "default",
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, settings: data });
}
