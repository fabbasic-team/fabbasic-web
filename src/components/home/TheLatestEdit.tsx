"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Scissors, Layers } from "lucide-react";
import { Product, Category } from "@/types";
import ProductCard from "@/components/product/ProductCard";

interface TheLatestEditProps {
  products: Product[];
  categories?: Category[];
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  viewAllLink?: string;
}

export default function TheLatestEdit({
  products,
  categories = [],
  title = "Newly Added Fabric Selections",
  eyebrow = "THE LATEST EDIT",
  subtitle = "Handpicked bolts woven for tailored shirts, bespoke suits, and ceremonial wear.",
  viewAllLink = "/collections",
}: TheLatestEditProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Derive unique categories present in products if not provided
  const categoryFilters = useMemo(() => {
    if (categories && categories.length > 0) {
      return [{ id: "all", name: "All Fabrics", slug: "all" }, ...categories];
    }
    return [{ id: "all", name: "All Fabrics", slug: "all" }];
  }, [categories]);

  // Filter products based on selected tab
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;
    }
    return products.filter((p) => {
      if (p.category_id === selectedCategory) return true;
      if (p.category?.slug === selectedCategory) return true;
      return false;
    });
  }, [products, selectedCategory]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-ivory-light border-t border-beige-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] sm:text-xs uppercase tracking-widest text-gold font-semibold">
                {eyebrow}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold/60 inline-block" />
              <span className="text-[11px] uppercase tracking-wider text-charcoal/60 font-medium">
                Sold by the Metre &amp; Unit
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-navy font-light tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-charcoal font-light mt-1 max-w-xl">
              {subtitle}
            </p>
          </div>

          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-luxury text-navy hover:text-gold transition-colors group self-start md:self-end"
          >
            <span>Explore All Fabrics</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Interactive Category Filter Tabs */}
        {categoryFilters.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar border-b border-beige-border/50">
            {categoryFilters.map((tab) => {
              const isActive =
                selectedCategory === tab.id || selectedCategory === tab.slug;
              
              // Count matching products
              const count =
                tab.id === "all"
                  ? products.length
                  : products.filter(
                      (p) =>
                        p.category_id === tab.id || p.category?.slug === tab.slug
                    ).length;

              return (
                <button
                  key={tab.id || tab.slug}
                  onClick={() => setSelectedCategory(tab.id || tab.slug)}
                  className={`px-4 py-2 text-xs uppercase tracking-luxury rounded-sm transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? "bg-navy text-gold font-semibold shadow-sm border border-navy"
                      : "bg-white hover:bg-beige-subtle text-charcoal hover:text-navy border border-beige-border"
                  }`}
                >
                  <span>{tab.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive
                        ? "bg-gold/20 text-gold"
                        : "bg-slate-100 text-charcoal/60"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-white border border-beige-border rounded-sm">
            <Scissors className="w-8 h-8 text-gold/60 mx-auto mb-2" />
            <p className="text-sm font-serif text-navy">
              No fabrics currently in this category.
            </p>
            <p className="text-xs text-charcoal/60 mt-1">
              Select another category or browse all fabrics.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
