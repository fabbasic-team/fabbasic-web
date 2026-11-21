import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json({ products: [] });
    }

    const ids = idsParam
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (ids.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const supabase = createAdminClient();
    const { data: products, error } = await supabase
      .from("products")
      .select(`
        *,
        images:product_images(*)
      `)
      .in("id", ids)
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching wishlist products:", error);
      return NextResponse.json({ products: [] });
    }

    return NextResponse.json({ products: products || [] });
  } catch (error: any) {
    console.error("Wishlist products API error:", error);
    return NextResponse.json({ error: error.message, products: [] }, { status: 500 });
  }
}
