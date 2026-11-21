"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Scissors } from "lucide-react";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url;

  const isFavorited = isInWishlist(product.id);

  const isPerMetre = product.selling_unit === "per_metre";
  const isSet = product.selling_unit === "set";
  const unitLabel = isPerMetre ? "/ metre" : isSet ? "/ set" : "/ pc";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: `${product.id}-${product.min_order_qty}`,
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      sellingUnit: product.selling_unit,
      quantity: product.min_order_qty || 1,
      image: primaryImage || "",
      brand: product.brand || undefined,
      composition: product.fabric_composition || undefined,
      width: product.fabric_width || undefined,
      colorName: product.color_name || undefined,
      maxStock: product.stock_qty,
      minOrderQty: product.min_order_qty,
      qtyStep: product.qty_step,
    });
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div className="group relative flex flex-col bg-white border border-beige-border hover:border-gold/60 transition-all duration-300 shadow-sm hover:shadow-lg">
      
      {/* Product Image Box */}
      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] w-full bg-beige-subtle overflow-hidden block">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-deep via-navy to-[#182647] flex flex-col items-center justify-center p-4 text-center text-ivory relative">
            <div className="w-11 h-11 rounded-full border border-gold/40 bg-navy/60 backdrop-blur-xs flex items-center justify-center text-gold mb-2 group-hover:scale-110 transition-transform duration-300">
              <Scissors className="w-4 h-4" />
            </div>
            <span className="text-[9px] uppercase tracking-luxury text-gold font-bold">
              FAB BASIC
            </span>
            <span className="text-xs text-ivory font-serif mt-1 line-clamp-1">
              {product.fabric_type || "Fine Fabric"}
            </span>
            <span className="text-[10px] text-ivory/60 mt-0.5 line-clamp-1 max-w-[130px]">
              {product.fabric_composition || "Certified Mill Cloth"}
            </span>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
            isFavorited
              ? "bg-navy text-gold shadow-md"
              : "bg-white/85 hover:bg-white text-navy backdrop-blur-sm shadow-sm"
          }`}
          aria-label={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 stroke-[1.8] ${isFavorited ? "fill-gold text-gold" : ""}`}
          />
        </button>

        {/* Exclusive or Featured Tag */}
        {product.is_exclusive && (
          <span className="absolute top-3 left-3 bg-navy text-gold text-[9px] tracking-luxury uppercase px-2 py-0.5 font-bold shadow-sm">
            Bespoke Luxury
          </span>
        )}
        {!product.is_exclusive && product.compare_at_price && product.compare_at_price > product.price && (
          <span className="absolute top-3 left-3 bg-gold text-navy text-[9px] tracking-luxury uppercase px-2 py-0.5 font-bold shadow-sm">
            Privilege Offer
          </span>
        )}

        {/* Metre Cut Specification Indicator */}
        {isPerMetre && (
          <span className="absolute bottom-2 left-2 bg-navy-deep/85 backdrop-blur-xs text-ivory text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-mono border border-gold/30">
            Min cut: {product.min_order_qty}m
          </span>
        )}

        {/* Quick Add Overlay on hover (Desktop) */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-navy-deep/90 via-navy-deep/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden sm:flex justify-center">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 bg-gold hover:bg-gold-hover text-navy text-xs uppercase tracking-luxury font-semibold transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>
              Add to Bag ({product.min_order_qty}
              {isPerMetre ? "m" : isSet ? " set" : " pc"})
            </span>
          </button>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white border-t border-beige-border/40">
        <div>
          {/* Brand or Fabric Spec */}
          <div className="flex items-center justify-between text-[11px] text-charcoal/80 mb-1 gap-1">
            <span className="uppercase tracking-wider truncate font-medium text-navy/80">
              {product.fabric_type || product.brand || "Fine Cloth"}
            </span>
            {product.fabric_width && (
              <span className="text-[10px] text-charcoal/60 bg-ivory-dark px-1.5 py-0.5 rounded border border-beige-border whitespace-nowrap">
                {product.fabric_width}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`} className="block group-hover:text-gold transition-colors">
            <h3 className="text-sm font-medium text-navy line-clamp-1 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Fabric Composition */}
          {product.fabric_composition && (
            <p className="text-[11px] text-charcoal/60 line-clamp-1 mt-0.5 font-light">
              {product.fabric_composition}
            </p>
          )}
        </div>

        {/* Price & Unit */}
        <div className="mt-3 pt-2 border-t border-beige-border/40 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold text-navy font-serif">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-charcoal/70 font-medium">
              {unitLabel}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-xs text-charcoal/50 line-through">
                ₹{Number(product.compare_at_price).toLocaleString("en-IN")}
              </span>
            )}
          </div>

          {/* Stock state */}
          <span className="text-[10px] text-charcoal/70 uppercase tracking-subtle font-medium">
            {product.stock_qty > 0 ? "In Stock" : "Tailor On Order"}
          </span>
        </div>
      </div>
    </div>
  );
}
