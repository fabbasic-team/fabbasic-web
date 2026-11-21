"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";

export default function WishlistClient() {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadWishlistProducts() {
      if (wishlist.length === 0) {
        if (isMounted) {
          setProducts([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/products/by-ids?ids=${wishlist.join(",")}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setProducts(data.products || []);
          }
        }
      } catch (err) {
        console.error("Failed to load wishlist products:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadWishlistProducts();

    return () => {
      isMounted = false;
    };
  }, [wishlist]);

  return (
    <div className="py-12 sm:py-20 bg-ivory min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-[11px] uppercase tracking-luxury text-gold font-semibold mb-2">
            CURATED SELECTIONS
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-navy font-light tracking-tight">
            Your Bespoke Wishlist
          </h1>
          <div className="w-14 h-[1.5px] bg-gold mx-auto my-4" />
          <p className="text-xs sm:text-sm text-charcoal font-light leading-relaxed">
            Reserved fabrics and tailoring cloths chosen for your bespoke wardrobe.
          </p>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-navy/60 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-gold" />
            <span className="text-xs tracking-luxury uppercase font-medium">
              Loading Saved Cloths...
            </span>
          </div>
        ) : wishlist.length === 0 || products.length === 0 ? (
          /* Refined Luxury Empty State */
          <div className="max-w-md mx-auto text-center py-16 px-6 bg-white border border-beige-border rounded-sm shadow-sm space-y-6">
            <div className="w-16 h-16 rounded-full bg-beige-subtle mx-auto flex items-center justify-center text-gold border border-beige-border">
              <Heart className="w-7 h-7 stroke-[1.25]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-serif text-navy font-light">
                Your Wishlist is Empty
              </h2>
              <p className="text-xs text-charcoal font-light leading-relaxed max-w-sm mx-auto">
                Explore our shirting fabrics, worsted wool suiting, and traditional weaves. Click the heart icon on any cloth to save it here for later.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/collections"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-navy text-ivory text-xs uppercase tracking-luxury font-semibold hover:bg-gold hover:text-navy transition-all duration-300 shadow-sm"
              >
                <span>Discover Collections</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div>
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-beige-border">
              <p className="text-xs text-charcoal font-medium">
                Showing <span className="font-semibold text-navy">{products.length}</span> saved{" "}
                {products.length === 1 ? "fabric" : "fabrics"}
              </p>
              <Link
                href="/collections"
                className="text-xs text-gold hover:text-navy font-semibold uppercase tracking-luxury transition-colors flex items-center gap-1.5"
              >
                <span>Continue Browsing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
