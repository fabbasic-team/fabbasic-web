import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/utils/auth";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("fab_admin_session")?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const supabase = createAdminClient();

  if (id) {
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(*)")
      .eq("id", id)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ product: data });
  }

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data || [] });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get("fab_admin_session")?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { images = [], ...productFields } = body;
  const supabase = createAdminClient();

  const slug =
    productFields.slug ||
    productFields.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") +
      `-${Date.now().toString().slice(-4)}`;

  const { data: newProduct, error: prodErr } = await supabase
    .from("products")
    .insert([
      {
        ...productFields,
        slug,
      },
    ])
    .select()
    .single();

  if (prodErr) {
    return NextResponse.json({ error: prodErr.message }, { status: 500 });
  }

  if (images && images.length > 0) {
    const imageRows = images.map((img: any, idx: number) => ({
      product_id: newProduct.id,
      image_url: img.url,
      image_public_id: img.public_id || null,
      alt_text: img.alt || newProduct.title,
      is_primary: idx === 0 || img.is_primary === true,
      display_order: idx + 1,
    }));

    await supabase.from("product_images").insert(imageRows);
  }

  return NextResponse.json({ success: true, product: newProduct });
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("fab_admin_session")?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, images, category, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: updatedProduct, error: updateErr } = await supabase
    .from("products")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  if (images && Array.isArray(images)) {
    await supabase.from("product_images").delete().eq("product_id", id);

    if (images.length > 0) {
      const imageRows = images.map((img: any, idx: number) => ({
        product_id: id,
        image_url: img.image_url || img.url,
        image_public_id: img.image_public_id || img.public_id || null,
        alt_text: img.alt_text || img.alt || updatedProduct.title,
        is_primary: idx === 0 || img.is_primary === true,
        display_order: idx + 1,
      }));

      await supabase.from("product_images").insert(imageRows);
    }
  }

  return NextResponse.json({ success: true, product: updatedProduct });
}

export async function DELETE(request: NextRequest) {
  const token = request.cookies.get("fab_admin_session")?.value;
  if (!(await verifyAdminSession(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
