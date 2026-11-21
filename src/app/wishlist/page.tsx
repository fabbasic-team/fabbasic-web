"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types";

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a full implementation, fetch product details for wishlist IDs
    setLoading(false);
  }, [wishlist]);

  return (
    <div className="py-16 bg-ivory min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-luxury text-gold font-semibold mb-2">
            YOUR SAVED SELECTIONS
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif text-navy font-light">
            Bespoke Wishlist
          </h1>
          <div className="w-12 h-[1px] bg-gold mx-auto my-4" />
          <p className="text-sm text-charcoal font-light">
            Keep track of fabrics and bespoke cuts you are considering for your wardrobe.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16 space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-beige-subtle mx-auto flex items-center justify-center text-gold">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-serif text-navy">Your wishlist is empty</h2>
            <p className="text-xs text-charcoal leading-relaxed">
              Explore our fabric collections and click the heart icon on any fabric to save it here for later.
            </p>
            <Link
              href="/collections"
              className="inline-block px-6 py-2.5 bg-navy text-ivory text-xs uppercase tracking-luxury font-semibold hover:bg-gold hover:text-navy transition-colors"
            >
              Discover Fabrics
            </Link>
          </div>
        ) : (
          <div className="text-center text-sm text-charcoal">
            <p>You have {wishlist.length} item(s) saved in your wishlist.</p>
          </div>
        )}
      </div>
    </div>
  );
}
