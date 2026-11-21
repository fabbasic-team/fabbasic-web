"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Scissors,
  Check,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const router = useRouter();
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const images =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.image_url)
      : [];

  const [selectedImage, setSelectedImage] = useState<string | null>(
    images[0] || null
  );
  const [quantity, setQuantity] = useState(product.min_order_qty || 1.0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isPerMetre = product.selling_unit === "per_metre";
  const step = product.qty_step || (isPerMetre ? 0.5 : 1);
  const minQty = product.min_order_qty || 1;

  const handleQuantityChange = (delta: number) => {
    const newQty = Number((quantity + delta).toFixed(2));
    if (newQty >= minQty && (product.stock_qty <= 0 || newQty <= product.stock_qty)) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${quantity}`,
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      sellingUnit: product.selling_unit,
      quantity,
      image: selectedImage || "",
      brand: product.brand || undefined,
      composition: product.fabric_composition || undefined,
      width: product.fabric_width || undefined,
      colorName: product.color_name || undefined,
      maxStock: product.stock_qty,
      minOrderQty: product.min_order_qty,
      qtyStep: product.qty_step,
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    openCart();
    router.push("/checkout");
  };

  const totalPrice = Number((product.price * quantity).toFixed(2));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
      
      {/* Left: Gallery Column */}
      <div className="lg:col-span-7 space-y-4">
        {/* Main Image View */}
        <div className="relative aspect-[4/5] w-full bg-white border border-beige-border overflow-hidden rounded-sm shadow-sm group">
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt={product.title}
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          ) : (
            <div className="w-full h-full bg-navy-deep flex flex-col items-center justify-center p-8 text-center text-ivory">
              <div className="w-16 h-16 rounded-full border border-gold/40 flex items-center justify-center text-gold mb-4">
                <Scissors className="w-8 h-8" />
              </div>
              <span className="text-xs uppercase tracking-luxury text-gold font-mono font-bold">
                FAB BASIC ATELIER
              </span>
              <h2 className="text-xl font-serif text-ivory mt-2">
                {product.title}
              </h2>
              <p className="text-xs text-ivory/60 mt-1 max-w-xs">
                {product.fabric_composition || "Premium Mill Cloth"}
              </p>
            </div>
          )}

          {/* Exclusive Badge */}
          {product.is_exclusive && (
            <span className="absolute top-4 left-4 bg-navy text-gold text-xs tracking-luxury uppercase px-3 py-1 font-semibold shadow-md">
              Exclusive Suiting
            </span>
          )}

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
              isFavorited
                ? "bg-navy text-gold shadow-lg"
                : "bg-white/90 hover:bg-white text-navy backdrop-blur-sm shadow-md"
            }`}
            aria-label="Toggle wishlist"
          >
            <Heart
              className={`w-5 h-5 stroke-[1.8] ${isFavorited ? "fill-gold text-gold" : ""}`}
            />
          </button>
        </div>

        {/* Thumbnail Selector (if multiple images) */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-24 flex-shrink-0 border-2 overflow-hidden rounded-sm transition-all ${
                  selectedImage === img
                    ? "border-gold shadow-md"
                    : "border-beige-border hover:border-charcoal/40 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.title} view ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Specifications & Purchasing Column */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Header & Brand */}
        <div className="border-b border-beige-border pb-5">
          <p className="text-xs uppercase tracking-luxury text-gold font-semibold mb-1">
            {product.brand || product.fabric_type || "Fine Cloth"}
          </p>
          <h1 className="text-2xl sm:text-4xl font-serif text-navy font-light leading-tight">
            {product.title}
          </h1>

          {/* Price & Unit */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-semibold text-navy">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-charcoal/80">
              {isPerMetre ? "per metre" : "per piece"}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-sm text-charcoal/50 line-through">
                ₹{Number(product.compare_at_price).toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {/* Fabric Specifications Grid */}
        <div className="bg-beige-subtle/50 p-4 border border-beige-border rounded-sm space-y-3">
          <p className="text-xs uppercase tracking-luxury text-navy font-semibold">
            Fabric Specifications
          </p>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
            {product.fabric_composition && (
              <div>
                <span className="text-charcoal/70 block">Composition:</span>
                <span className="font-medium text-navy">{product.fabric_composition}</span>
              </div>
            )}
            {product.fabric_width && (
              <div>
                <span className="text-charcoal/70 block">Fabric Width:</span>
                <span className="font-medium text-navy">{product.fabric_width}</span>
              </div>
            )}
            {product.fabric_weight && (
              <div>
                <span className="text-charcoal/70 block">Weight:</span>
                <span className="font-medium text-navy">{product.fabric_weight}</span>
              </div>
            )}
            {product.fabric_pattern && (
              <div>
                <span className="text-charcoal/70 block">Weave / Pattern:</span>
                <span className="font-medium text-navy">{product.fabric_pattern}</span>
              </div>
            )}
            {product.color_name && (
              <div>
                <span className="text-charcoal/70 block">Colourway:</span>
                <span className="font-medium text-navy flex items-center gap-1.5 mt-0.5">
                  {product.color_hex && (
                    <span
                      className="w-3 h-3 rounded-full border border-charcoal/30 inline-block"
                      style={{ backgroundColor: product.color_hex }}
                    />
                  )}
                  {product.color_name}
                </span>
              </div>
            )}
            {product.sku && (
              <div>
                <span className="text-charcoal/70 block">SKU / Bolt Ref:</span>
                <span className="font-medium text-navy font-mono text-[11px]">{product.sku}</span>
              </div>
            )}
          </div>
        </div>

        {/* Quantity in Metres / Units Selector */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-luxury text-navy font-semibold flex items-center gap-1.5">
              <Scissors className="w-4 h-4 text-gold" />
              <span>
                {isPerMetre ? "Custom Metre Length" : "Select Quantity"}
              </span>
            </label>
            <span className="text-xs text-charcoal">
              {product.stock_qty > 0
                ? `${product.stock_qty} ${isPerMetre ? "metres" : "units"} in stock`
                : "Bespoke order available"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-beige-border bg-white rounded p-1">
              <button
                type="button"
                onClick={() => handleQuantityChange(-step)}
                disabled={quantity <= minQty}
                className="w-10 h-10 flex items-center justify-center text-navy hover:bg-beige-subtle transition-colors disabled:opacity-40"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="w-20 text-center font-semibold text-navy text-sm">
                {quantity} {isPerMetre ? "m" : "pcs"}
              </div>
              <button
                type="button"
                onClick={() => handleQuantityChange(step)}
                disabled={product.stock_qty > 0 && quantity >= product.stock_qty}
                className="w-10 h-10 flex items-center justify-center text-navy hover:bg-beige-subtle transition-colors disabled:opacity-40"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Live Line Total Calculation */}
            <div className="flex-1 text-right">
              <span className="text-xs text-charcoal block">Total Fabric Cost:</span>
              <span className="text-xl font-bold text-navy">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {isPerMetre && (
            <p className="text-[11px] text-charcoal/70">
              Min cut: {minQty}m • Cut in increments of {step}m. Standard full suit: 3.25m • Standard shirt: 1.6m.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-3">
          <button
            onClick={handleAddToCart}
            className={`w-full py-4 bg-navy hover:bg-navy-deep text-ivory text-xs uppercase tracking-luxury font-semibold transition-all duration-300 flex items-center justify-center gap-3 rounded shadow-md ${
              addedAnimation ? "bg-gold text-navy" : ""
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Shopping Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 text-gold" />
                <span>Add {quantity}{isPerMetre ? " Metres" : " Units"} to Bag — ₹{totalPrice.toLocaleString("en-IN")}</span>
              </>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            className="w-full py-3.5 bg-gold hover:bg-gold-hover text-navy text-xs uppercase tracking-luxury font-bold transition-all duration-200 rounded shadow"
          >
            Instant Bespoke Checkout
          </button>
        </div>

        {/* Assurances */}
        <div className="border-t border-beige-border pt-5 space-y-3 text-xs text-charcoal">
          <div className="flex items-center gap-3">
            <Truck className="w-4 h-4 text-gold flex-shrink-0" />
            <span>Complimentary insured shipping on orders above ₹2,999.</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
            <span>100% genuine certified mill cloth with authenticity guarantee.</span>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-gold flex-shrink-0" />
            <span>Fabric swatches cut with master tailor precision pinking shears.</span>
          </div>
        </div>

        {/* Product Description */}
        {product.description && (
          <div className="border-t border-beige-border pt-5 space-y-2">
            <h3 className="text-xs uppercase tracking-luxury text-navy font-semibold">
              Curator&apos;s Notes
            </h3>
            <p className="text-sm text-charcoal font-light leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
