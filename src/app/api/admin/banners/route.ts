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
    .from("homepage_banners")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ banners: data || [] });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("fab_admin_session")?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const supabase = createAdminClient();

  const { count } = await supabase
    .from("homepage_banners")
    .select("*", { count: "exact", head: true });

  if ((count || 0) >= 3) {
    return NextResponse.json(
      { error: "Maximum limit of 3 homepage hero banners reached. Please edit or remove an existing banner." },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("homepage_banners")
    .insert([
      {
        title: body.title,
        eyebrow: body.eyebrow || null,
        subtitle: body.subtitle || null,
        cta_text: body.cta_text || "Shop the Collection",
        cta_link: body.cta_link || "/collections",
        desktop_image_url: body.desktop_image_url,
        desktop_image_public_id: body.desktop_image_public_id || null,
        mobile_image_url: body.mobile_image_url || null,
        mobile_image_public_id: body.mobile_image_public_id || null,
        text_alignment: body.text_alignment || "left",
        overlay_intensity: body.overlay_intensity ?? 40,
        display_order: body.display_order || 1,
        is_active: body.is_active ?? true,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, banner: data });
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("fab_admin_session")?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Banner ID is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("homepage_banners")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, banner: data });
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get("fab_admin_session")?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Banner ID is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("homepage_banners").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
