import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/utils/auth";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("fab_admin_session")?.value;
  const session = await verifyAdminSession(token);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  let tablesReady = false;
  let stats = {
    productsCount: 0,
    categoriesCount: 0,
    bannersCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
    pendingOrdersCount: 0,
  };

  try {
    const { count: prodCount, error: prodErr } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (!prodErr) {
      tablesReady = true;
      stats.productsCount = prodCount || 0;

      const { count: catCount } = await supabase
        .from("categories")
        .select("*", { count: "exact", head: true });
      stats.categoriesCount = catCount || 0;

      const { count: banCount } = await supabase
        .from("homepage_banners")
        .select("*", { count: "exact", head: true });
      stats.bannersCount = banCount || 0;

      const { data: orders } = await supabase
        .from("orders")
        .select("total_amount, order_status, payment_status");

      if (orders) {
        stats.ordersCount = orders.length;
        stats.totalRevenue = orders
          .filter((o) => o.payment_status === "paid")
          .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
        stats.pendingOrdersCount = orders.filter(
          (o) => o.order_status === "pending" || o.order_status === "confirmed"
        ).length;
      }
    }
  } catch (err) {
    console.error("DB Status check:", err);
  }

  return NextResponse.json({
    tablesReady,
    stats,
  });
}
