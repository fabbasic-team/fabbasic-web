"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { ShieldCheck, Lock, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { ShippingAddress } from "@/types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const freeShippingThreshold = 2999;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 199;
  const finalTotal = subtotal + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart.length) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Create order on server
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: address,
          items: cart,
          shippingFee,
        }),
      });

      const orderData = await res.json();
      if (!res.ok) {
        throw new Error(orderData.error || "Failed to initialize order");
      }

      const { orderNumber, razorpayOrderId, razorpayKeyId } = orderData;

      // 2. If Razorpay keys are active and order ID is returned, open Razorpay Checkout
      if (razorpayOrderId && window.Razorpay && razorpayKeyId) {
        const options = {
          key: razorpayKeyId,
          amount: Math.round(finalTotal * 100),
          currency: "INR",
          name: "FAB BASIC",
          description: `Order #${orderNumber} — Fabric Tailoring Cuts`,
          image: "/fab-basic-logo.png",
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            // Verify payment on server
            const verifyRes = await fetch("/api/orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderNumber,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (verifyRes.ok) {
              clearCart();
              router.push(`/order-success?order=${orderNumber}`);
            } else {
              router.push(`/order-success?order=${orderNumber}&status=pending_verification`);
            }
          },
          prefill: {
            name: address.fullName,
            email: address.email,
            contact: address.phone,
          },
          theme: {
            color: "#101B35",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setError(`Payment failed: ${response.error.description}`);
          setLoading(false);
        });
        rzp.open();
      } else {
        // Fallback demo order placement when Razorpay keys are in testing mode
        clearCart();
        router.push(`/order-success?order=${orderNumber}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during checkout. Please try again.");
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col justify-center items-center px-4 py-16">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-3xl font-serif text-navy">Your bag is empty</h1>
          <p className="text-sm text-charcoal font-light">
            Please add fabric selections to your shopping bag before proceeding to checkout.
          </p>
          <Link
            href="/collections"
            className="inline-block px-8 py-3 bg-navy text-ivory text-xs uppercase tracking-luxury font-semibold hover:bg-gold hover:text-navy transition-colors"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="min-h-screen bg-ivory py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Brand Bar */}
          <div className="flex items-center justify-between pb-8 mb-8 border-b border-beige-border">
            <Link href="/" className="relative w-36 h-10 block">
              <Image
                src="/fab-basic-logo.png"
                alt="FAB BASIC"
                fill
                className="object-contain object-left"
              />
            </Link>
            <div className="flex items-center gap-2 text-xs text-charcoal">
              <Lock className="w-3.5 h-3.5 text-gold" />
              <span>256-Bit SSL Encrypted Bespoke Checkout</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Form Column */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmitOrder} className="space-y-8">
                
                {/* Shipping Details */}
                <div className="bg-white p-6 sm:p-8 border border-beige-border rounded-sm space-y-6">
                  <div>
                    <h2 className="text-xl font-serif text-navy font-normal">
                      Delivery &amp; Client Address
                    </h2>
                    <p className="text-xs text-charcoal/80 mt-1">
                      Where our courier partner will deliver your fabric bolts.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase tracking-luxury text-charcoal font-medium mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={address.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-2.5 bg-ivory border border-beige-border text-navy text-sm rounded focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-luxury text-charcoal font-medium mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={address.email}
                        onChange={handleInputChange}
                        required
                        placeholder="rahul@example.com"
                        className="w-full px-4 py-2.5 bg-ivory border border-beige-border text-navy text-sm rounded focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-luxury text-charcoal font-medium mb-1">
                        Mobile Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={address.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-2.5 bg-ivory border border-beige-border text-navy text-sm rounded focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase tracking-luxury text-charcoal font-medium mb-1">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        value={address.addressLine1}
                        onChange={handleInputChange}
                        required
                        placeholder="Flat / House / Suite, Street Name"
                        className="w-full px-4 py-2.5 bg-ivory border border-beige-border text-navy text-sm rounded focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase tracking-luxury text-charcoal font-medium mb-1">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={address.addressLine2}
                        onChange={handleInputChange}
                        placeholder="Landmark, Area, Building"
                        className="w-full px-4 py-2.5 bg-ivory border border-beige-border text-navy text-sm rounded focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-luxury text-charcoal font-medium mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleInputChange}
                        required
                        placeholder="Mumbai"
                        className="w-full px-4 py-2.5 bg-ivory border border-beige-border text-navy text-sm rounded focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-luxury text-charcoal font-medium mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={address.state}
                        onChange={handleInputChange}
                        required
                        placeholder="Maharashtra"
                        className="w-full px-4 py-2.5 bg-ivory border border-beige-border text-navy text-sm rounded focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-luxury text-charcoal font-medium mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={address.postalCode}
                        onChange={handleInputChange}
                        required
                        placeholder="400001"
                        className="w-full px-4 py-2.5 bg-ivory border border-beige-border text-navy text-sm rounded focus:outline-none focus:border-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-luxury text-charcoal font-medium mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={address.country}
                        disabled
                        className="w-full px-4 py-2.5 bg-beige-subtle border border-beige-border text-navy text-sm rounded opacity-80"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit / Pay Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-navy hover:bg-navy-deep text-ivory text-xs uppercase tracking-luxury font-semibold transition-all duration-300 rounded shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-gold" />
                      <span>Initializing Secure Gateway...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-gold" />
                      <span>Proceed to Payment — ₹{finalTotal.toLocaleString("en-IN")}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary Column */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 sm:p-8 border border-beige-border rounded-sm space-y-6 sticky top-24 shadow-sm">
                <h3 className="text-lg font-serif text-navy border-b border-beige-border pb-3">
                  Fabric Order Summary ({cart.length})
                </h3>

                <div className="divide-y divide-beige-border max-h-[350px] overflow-y-auto space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-3 flex gap-4">
                      <div className="relative w-16 h-20 bg-beige-subtle flex-shrink-0 overflow-hidden border border-beige-border rounded flex items-center justify-center">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-navy/5 flex items-center justify-center text-xs font-serif text-navy/40">
                            FB
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-xs">
                        <p className="font-medium text-navy line-clamp-1">{item.title}</p>
                        <p className="text-charcoal/70 text-[11px] mt-0.5">
                          {item.quantity} {item.sellingUnit === "per_metre" ? "metres" : "pieces"} @ ₹{item.price.toLocaleString("en-IN")}
                        </p>
                        <p className="font-semibold text-navy mt-1">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-beige-border pt-4 space-y-2 text-xs text-charcoal">
                  <div className="flex justify-between">
                    <span>Fabric Subtotal</span>
                    <span className="font-medium text-navy">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bespoke Insured Delivery</span>
                    <span className="font-medium text-navy">
                      {shippingFee === 0 ? (
                        <span className="text-gold font-bold">Complimentary</span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-navy pt-2 border-t border-beige-border">
                    <span>Total Payable</span>
                    <span>₹{finalTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="bg-ivory p-4 border border-beige-border text-xs text-charcoal/80 space-y-2">
                  <p className="font-semibold text-navy flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-gold" />
                    Bespoke Fabric Assurance
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    All fabrics are inspected and measured by master clothiers before dispatch. Packaged in moisture-resistant protective covers.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
