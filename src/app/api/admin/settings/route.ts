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
  let exclusiveFeature = null;

  if (
    data?.brand_story_image &&
    typeof data.brand_story_image === "string" &&
    data.brand_story_image.startsWith("{")
  ) {
    try {
      const parsed = JSON.parse(data.brand_story_image);
      if (parsed.editorial_feature) {
        editorialFeature = parsed.editorial_feature;
      } else if (parsed.heading) {
        editorialFeature = parsed;
      }
      if (parsed.exclusive_feature) {
        exclusiveFeature = parsed.exclusive_feature;
      }
    } catch (e) {
      console.error(e);
    }
  }

  return NextResponse.json({
    settings: {
      ...data,
      editorial_feature: editorialFeature,
      exclusive_feature: exclusiveFeature,
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

  // If editorial_feature or exclusive_feature is provided, merge and store structured in brand_story_image
  if (updates.editorial_feature !== undefined || updates.exclusive_feature !== undefined) {
    const { data: current } = await supabase
      .from("store_settings")
      .select("brand_story_image")
      .eq("id", "default")
      .maybeSingle();

    let existingJson: any = {};
    if (
      current?.brand_story_image &&
      typeof current.brand_story_image === "string" &&
      current.brand_story_image.startsWith("{")
    ) {
      try {
        existingJson = JSON.parse(current.brand_story_image);
      } catch {}
    }

    const mergedPayload = {
      editorial_feature:
        updates.editorial_feature !== undefined
          ? updates.editorial_feature
          : existingJson.editorial_feature || (existingJson.heading ? existingJson : undefined),
      exclusive_feature:
        updates.exclusive_feature !== undefined
          ? updates.exclusive_feature
          : existingJson.exclusive_feature,
    };

    updates.brand_story_image = JSON.stringify(mergedPayload);
    delete updates.editorial_feature;
    delete updates.exclusive_feature;
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
