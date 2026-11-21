"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { Product } from "@/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search query
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-deep/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-screen px-4 text-center flex flex-col items-center pt-16 sm:pt-24 z-50 relative">
        <div className="w-full max-w-2xl bg-white shadow-2xl rounded-sm border border-beige-border overflow-hidden text-left animate-fade-in">
          
          {/* Input Box */}
          <div className="p-4 sm:p-5 border-b border-beige-border flex items-center gap-3 bg-ivory">
            <Search className="w-5 h-5 text-gold flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search fabrics, weaves, Egyptian cotton, wool, silk..."
              className="flex-1 bg-transparent text-navy placeholder-charcoal/60 text-base sm:text-lg focus:outline-none"
            />
            {loading && <Loader2 className="w-4 h-4 text-gold animate-spin" />}
            <button
              onClick={onClose}
              className="p-1 text-charcoal hover:text-navy transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Suggestions when empty */}
          {!searchTerm.trim() && (
            <div className="p-6 bg-white space-y-4">
              <p className="text-xs uppercase tracking-luxury text-charcoal font-semibold">
                Curated Fabric Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Egyptian Giza Cotton",
                  "Super 130s Wool",
                  "Linen Shirting",
                  "Royal Oxford",
                  "Cashmere Blend",
                  "South Indian Veshti",
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-3 py-1.5 bg-beige-subtle hover:bg-beige text-xs text-navy rounded border border-beige-border transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchTerm.trim() && (
            <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 divide-y divide-beige-border/60">
              {results.length > 0 ? (
                results.map((product) => {
                  const image =
                    product.images?.find((i) => i.is_primary)?.image_url ||
                    product.images?.[0]?.image_url ||
                    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80";

                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 py-3 group hover:bg-beige-subtle/50 px-2 rounded transition-colors"
                    >
                      <div className="relative w-14 h-16 bg-beige-subtle flex-shrink-0 overflow-hidden border border-beige-border">
                        <Image
                          src={image}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] text-gold uppercase tracking-subtle font-medium">
                          {product.brand || product.fabric_type || "Fine Fabric"}
                        </p>
                        <h4 className="text-sm font-medium text-navy group-hover:text-gold transition-colors line-clamp-1">
                          {product.title}
                        </h4>
                        <p className="text-xs font-semibold text-navy mt-0.5">
                          ₹{Number(product.price).toLocaleString("en-IN")}{" "}
                          <span className="font-normal text-charcoal/70">
                            /{product.selling_unit === "per_metre" ? "metre" : "unit"}
                          </span>
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-charcoal/40 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                    </Link>
                  );
                })
              ) : (
                !loading && (
                  <div className="py-12 text-center text-charcoal">
                    <p className="font-serif text-lg text-navy">No fabrics found</p>
                    <p className="text-xs text-charcoal/70 mt-1">
                      No textiles matched &quot;{searchTerm}&quot;. Try exploring our collections or searching for cotton, linen, or wool.
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
