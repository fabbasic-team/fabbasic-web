import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/utils/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    const {
      orderNumber,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = await request.json();

    const supabase = createAdminClient();
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

    // 1. Signature Verification
    if (razorpayKeySecret && !razorpayKeySecret.includes("placeholder")) {
      const generatedSignature = crypto
        .createHmac("sha256", razorpayKeySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json(
          { error: "Invalid payment verification signature" },
          { status: 400 }
        );
      }
    }

    // 2. Update Order in Supabase
    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        order_status: "confirmed",
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        updated_at: new Date().toISOString(),
      })
      .eq("order_number", orderNumber)
      .select("*, items:order_items(*)")
      .single();

    if (updateError) {
      console.error("Failed to update order payment status:", updateError);
    }

    // 3. Decrement product inventory safely
    if (updatedOrder?.items) {
      for (const item of updatedOrder.items) {
        if (item.product_id) {
          const { data: prod } = await supabase
            .from("products")
            .select("stock_qty")
            .eq("id", item.product_id)
            .maybeSingle();

          if (prod) {
            const newStock = Math.max(0, Number(prod.stock_qty) - Number(item.quantity));
            await supabase
              .from("products")
              .update({
                stock_qty: newStock,
                is_in_stock: newStock > 0,
              })
              .eq("id", item.product_id);
          }
        }
      }
    }

    // 4. Send Brevo confirmation email if configured
    const brevoKey = process.env.BREVO_API_KEY;
    if (
      brevoKey &&
      !brevoKey.includes("placeholder") &&
      updatedOrder?.customer_email
    ) {
      try {
        await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "api-key": brevoKey,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            sender: {
              name: process.env.BREVO_SENDER_NAME || "FAB BASIC",
              email: process.env.BREVO_SENDER_EMAIL || "orders@fabbasic.com",
            },
            to: [
              {
                email: updatedOrder.customer_email,
                name: updatedOrder.customer_name,
              },
            ],
            subject: `Order Confirmation #${orderNumber} — FAB BASIC`,
            htmlContent: `
              <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #101B35; padding: 20px;">
                <h1 style="color: #101B35; font-size: 24px; border-bottom: 2px solid #B99A59; padding-bottom: 10px;">FAB BASIC</h1>
                <p style="text-transform: uppercase; letter-spacing: 2px; color: #B99A59; font-size: 12px;">STITCH • STYLE • ELEGANCE</p>
                <p>Dear ${updatedOrder.customer_name},</p>
                <p>Thank you for choosing FAB BASIC. We have received your order <strong>#${orderNumber}</strong> and our fabric curators are preparing your order for bespoke dispatch.</p>
                <p><strong>Total Amount Paid:</strong> ₹${Number(updatedOrder.total_amount).toLocaleString("en-IN")}</p>
                <p>Warm regards,<br/>The FAB BASIC Tailoring House</p>
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        console.error("Brevo order email error:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and order confirmed.",
      orderNumber,
    });
  } catch (error: any) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
