"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
  } = useCart();

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 2999;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-deep/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col z-50 animate-slide-left">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-beige-border flex items-center justify-between bg-ivory">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-gold" />
            <h2 className="text-sm uppercase tracking-luxury font-semibold text-navy">
              Shopping Bag ({totalItems})
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-1 text-charcoal hover:text-navy transition-colors"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-beige-subtle border-b border-beige-border text-xs text-charcoal">
          {remainingForFreeShipping > 0 ? (
            <p>
              Add <span className="font-semibold text-navy">₹{remainingForFreeShipping.toLocaleString("en-IN")}</span> more for complimentary bespoke delivery.
            </p>
          ) : (
            <p className="text-gold font-semibold flex items-center gap-1">
              ✓ You have unlocked complimentary bespoke delivery!
            </p>
          )}
          <div className="w-full bg-beige h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-gold h-full rounded-full transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-charcoal space-y-4">
              <div className="w-16 h-16 rounded-full bg-beige-subtle flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-gold/70" />
              </div>
              <p className="font-serif text-lg text-navy">Your bag is empty</p>
              <p className="text-xs max-w-xs text-charcoal/80">
                Discover our exceptional textiles, master tailoring fabrics, and ceremonial cuts.
              </p>
              <button
                onClick={closeCart}
                className="mt-2 px-6 py-2.5 bg-navy text-ivory text-xs uppercase tracking-luxury font-semibold hover:bg-gold hover:text-navy transition-colors"
              >
                Browse Collections
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const unitText = item.sellingUnit === "per_metre" ? "m" : "pc";
              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 bg-ivory border border-beige-border rounded-sm"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-white flex-shrink-0 overflow-hidden border border-beige-border flex items-center justify-center">
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

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="text-xs font-medium text-navy hover:text-gold transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-charcoal/60 hover:text-red-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Specs */}
                      <p className="text-[11px] text-charcoal/70 mt-0.5">
                        {item.composition || item.brand || "Fine Cloth"}
                        {item.width ? ` • ${item.width}` : ""}
                      </p>

                      <p className="text-xs font-semibold text-navy mt-1">
                        ₹{item.price.toLocaleString("en-IN")}{" "}
                        <span className="text-[10px] text-charcoal/70 font-normal">
                          /{item.sellingUnit === "per_metre" ? "metre" : "unit"}
                        </span>
                      </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between pt-2 border-t border-beige-border/50">
                      <div className="flex items-center border border-beige-border bg-white rounded">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              Math.max(
                                item.minOrderQty,
                                Number((item.quantity - item.qtyStep).toFixed(2))
                              )
                            )
                          }
                          disabled={item.quantity <= item.minOrderQty}
                          className="p-1 px-2 text-navy hover:bg-beige-subtle disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-medium min-w-[40px] text-center">
                          {item.quantity} {unitText}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              Number((item.quantity + item.qtyStep).toFixed(2))
                            )
                          }
                          className="p-1 px-2 text-navy hover:bg-beige-subtle"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <span className="text-xs font-bold text-navy">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-beige-border bg-ivory space-y-4">
            <div className="space-y-1.5 text-xs text-charcoal">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-navy">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-navy font-medium">
                  {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                    <span className="text-gold font-bold">Complimentary</span>
                  ) : (
                    "Calculated at checkout"
                  )}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-beige-border flex justify-between items-baseline">
              <span className="text-sm font-semibold uppercase tracking-luxury text-navy">
                Total
              </span>
              <span className="text-lg font-bold text-navy">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full py-3.5 bg-navy hover:bg-navy-deep text-ivory text-xs uppercase tracking-luxury font-semibold transition-all duration-200 flex items-center justify-center gap-2 rounded shadow-md hover:shadow-lg"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>

            <p className="text-[10px] text-center text-charcoal/60">
              Tax calculated at checkout • Secure encrypted payment via Razorpay
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
