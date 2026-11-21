"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Category, StoreSettings } from "@/types";

interface HeaderProps {
  categories: Category[];
  settings: StoreSettings;
  onOpenSearch: () => void;
}

export default function Header({ categories, settings, onOpenSearch }: HeaderProps) {
  const pathname = usePathname();
  const { openCart, totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Default fabric categories if database categories not yet configured
  const displayCategories = categories.length > 0 ? categories : [
    { id: "1", name: "Shirting Fabrics", slug: "shirting-fabrics", display_order: 1, is_active: true, is_nav_item: true, created_at: "", updated_at: "" },
    { id: "2", name: "Suiting Fabrics", slug: "suiting-fabrics", display_order: 2, is_active: true, is_nav_item: true, created_at: "", updated_at: "" },
    { id: "3", name: "Exclusive Luxury Suiting", slug: "exclusive-luxury-suiting", display_order: 3, is_active: true, is_nav_item: true, created_at: "", updated_at: "" },
    { id: "4", name: "Readymade", slug: "readymade", display_order: 4, is_active: true, is_nav_item: true, created_at: "", updated_at: "" },
    { id: "5", name: "Dhoti / Veshti", slug: "dhoti-veshti", display_order: 5, is_active: true, is_nav_item: true, created_at: "", updated_at: "" },
    { id: "6", name: "Accessories", slug: "accessories", display_order: 6, is_active: true, is_nav_item: true, created_at: "", updated_at: "" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 bg-ivory/95 backdrop-blur-md border-b ${
        isScrolled ? "border-beige-border shadow-sm py-2" : "border-beige-border/60 py-3 sm:py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-navy hover:text-gold transition-colors"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="inline-block relative group">
              <div className="relative w-36 sm:w-44 h-11 sm:h-12 flex items-center">
                <Image
                  src="/fab-basic-logo.png"
                  alt={`${settings.site_name} - ${settings.tagline}`}
                  fill
                  priority
                  className="object-contain object-left transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Center Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 xl:space-x-8">
            {displayCategories.map((cat) => {
              const isActive = pathname === `/collections/${cat.slug}`;
              return (
                <Link
                  key={cat.id || cat.slug}
                  href={`/collections/${cat.slug}`}
                  className={`text-[13px] tracking-subtle uppercase font-medium transition-colors duration-200 relative py-1 flex items-center gap-1 ${
                    isActive ? "text-gold font-semibold" : "text-navy hover:text-gold"
                  }`}
                >
                  <span>{cat.name}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gold animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-navy hover:text-gold transition-colors"
              aria-label="Search fabric catalog"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Admin / Account Link */}
            <Link
              href="/admin"
              className="p-2 text-navy hover:text-gold transition-colors hidden sm:flex items-center"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="p-2 text-navy hover:text-gold transition-colors relative"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {totalWishlistItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Shopping Bag Trigger */}
            <button
              onClick={openCart}
              className="p-2 text-navy hover:text-gold transition-colors relative"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-navy text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy-deep/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-ivory shadow-2xl flex flex-col justify-between z-50 border-r border-beige-border animate-slide-right">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-beige-border">
                <div className="relative w-36 h-10">
                  <Image
                    src="/fab-basic-logo.png"
                    alt={settings.site_name}
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-navy hover:text-gold transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="px-5 py-6 space-y-4">
                <p className="text-[11px] uppercase tracking-luxury text-gold font-semibold">
                  Collections
                </p>
                <div className="space-y-3">
                  {displayCategories.map((cat) => (
                    <Link
                      key={cat.id || cat.slug}
                      href={`/collections/${cat.slug}`}
                      className="block text-base font-medium text-navy hover:text-gold transition-colors py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>

                <div className="pt-4 border-t border-beige-border space-y-3">
                  <Link
                    href="/about"
                    className="block text-sm text-charcoal hover:text-navy transition-colors py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Our Heritage &amp; Craft
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-sm text-charcoal hover:text-navy transition-colors py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Client Concierge &amp; Tailoring
                  </Link>
                  <Link
                    href="/admin"
                    className="block text-sm text-gold hover:text-navy font-semibold transition-colors py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin CMS Login
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer Contact */}
            <div className="p-5 border-t border-beige-border bg-beige-subtle/50 text-xs text-charcoal space-y-1">
              <p className="font-semibold text-navy uppercase tracking-luxury">
                {settings.site_name}
              </p>
              <p>{settings.tagline}</p>
              <p className="pt-1">{settings.contact_phone}</p>
              <p>{settings.contact_email}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
