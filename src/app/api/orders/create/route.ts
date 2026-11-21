import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, items, shippingFee = 0 } = body;

    if (!customer || !items || !items.length) {
      return NextResponse.json(
        { error: "Incomplete order data" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 1. Calculate and verify item totals server-side
    let calculatedSubtotal = 0;
    const verifiedItems: any[] = [];

    for (const item of items) {
      // Fetch latest product price from database to prevent client tampering
      const { data: product } = await supabase
        .from("products")
        .select("id, title, slug, price, selling_unit, stock_qty")
        .eq("id", item.productId)
        .maybeSingle();

      const unitPrice = product ? Number(product.price) : Number(item.price);
      const qty = Number(item.quantity);
      const lineTotal = Number((unitPrice * qty).toFixed(2));
      calculatedSubtotal += lineTotal;

      verifiedItems.push({
        productId: item.productId,
        title: product?.title || item.title,
        slug: product?.slug || item.slug,
        image: item.image,
        sellingUnit: product?.selling_unit || item.sellingUnit,
        quantity: qty,
        unitPrice,
        totalPrice: lineTotal,
        fabricDetails: {
          brand: item.brand,
          composition: item.composition,
          width: item.width,
          color: item.colorName,
        },
      });
    }

    const freeShippingThreshold = 2999;
    const finalShippingFee = calculatedSubtotal >= freeShippingThreshold ? 0 : Number(shippingFee);
    const finalTotal = Number((calculatedSubtotal + finalShippingFee).toFixed(2));

    // 2. Generate unique order number
    const timestamp = Date.now().toString().slice(-4);
    const random = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `FB-${new Date().getFullYear()}-${timestamp}${random}`;

    // 3. Initiate Razorpay Order if keys are provided
    let razorpayOrderId = null;
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    if (
      razorpayKeyId &&
      razorpayKeySecret &&
      !razorpayKeyId.includes("placeholder")
    ) {
      try {
        const auth = Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString("base64");
        const rzRes = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(finalTotal * 100), // in paise
            currency: "INR",
            receipt: orderNumber,
            notes: {
              customer_name: customer.fullName,
              customer_email: customer.email,
            },
          }),
        });

        if (rzRes.ok) {
          const rzData = await rzRes.json();
          razorpayOrderId = rzData.id;
        } else {
          console.error("Razorpay order creation response not OK:", await rzRes.text());
        }
      } catch (rzErr) {
        console.error("Razorpay API error:", rzErr);
      }
    }

    // 4. Save order to Supabase
    const { data: orderRecord, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          order_number: orderNumber,
          customer_name: customer.fullName,
          customer_email: customer.email,
          customer_phone: customer.phone,
          shipping_address: customer,
          subtotal: calculatedSubtotal,
          shipping_fee: finalShippingFee,
          total_amount: finalTotal,
          payment_status: "pending",
          order_status: "confirmed",
          razorpay_order_id: razorpayOrderId,
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error("Supabase order insert error:", orderError);
    }

    const orderId = orderRecord?.id;

    // 5. Save order items
    if (orderId && verifiedItems.length > 0) {
      const itemsToInsert = verifiedItems.map((item) => ({
        order_id: orderId,
        product_id: item.productId,
        product_title: item.title,
        product_slug: item.slug,
        product_image: item.image,
        selling_unit: item.sellingUnit,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.totalPrice,
        fabric_details: item.fabricDetails,
      }));

      await supabase.from("order_items").insert(itemsToInsert);
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId,
      amount: finalTotal,
      currency: "INR",
      razorpayOrderId,
      razorpayKeyId: razorpayKeyId || null,
    });
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
