import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/utils/auth";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("fab_admin_session")?.value;
    const session = await verifyAdminSession(adminToken);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, imageUrl, imagePublicId, isPrimary = true } = body;

    if (!productId || !imageUrl) {
      return NextResponse.json(
        { error: "Product ID and Image URL are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // If setting as primary, demote existing primary images
    if (isPrimary) {
      await supabase
        .from("product_images")
        .update({ is_primary: false })
        .eq("product_id", productId);
    }

    // Insert new image
    const { data: newImage, error: imgErr } = await supabase
      .from("product_images")
      .insert([
        {
          product_id: productId,
          image_url: imageUrl,
          image_public_id: imagePublicId || null,
          is_primary: isPrimary,
          display_order: 1,
        },
      ])
      .select()
      .single();

    if (imgErr) {
      return NextResponse.json({ error: imgErr.message }, { status: 500 });
    }

    // Touch product updated_at
    await supabase
      .from("products")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", productId);

    return NextResponse.json({ success: true, image: newImage });
  } catch (error: any) {
    console.error("Add product image error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save product image" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const adminToken = request.cookies.get("fab_admin_session")?.value;
    const session = await verifyAdminSession(adminToken);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("id");

    if (!imageId) {
      return NextResponse.json({ error: "Image ID required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
