"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Category, StoreSettings } from "@/types";

interface HeaderProps {
  categories: Category[];
  settings: StoreSettings;
  onOpenSearch: () => void;
}

// Subcategory links for luxury mega-dropdowns
const CATEGORY_SUBMENUS: Record<
  string,
  { title: string; desc: string; items: { label: string; href: string }[] }
> = {
  "shirting-fabrics": {
    title: "Bespoke Shirting",
    desc: "Finest cottons, pure Irish linen, and breathable luxury weaves.",
    items: [
      { label: "Egyptian Giza Cotton", href: "/collections/shirting-fabrics?fabric=cotton" },
      { label: "Pure Irish & European Linen", href: "/collections/shirting-fabrics?fabric=linen" },
      { label: "Royal Oxford & Twill", href: "/collections/shirting-fabrics?weave=oxford" },
      { label: "Classic Stripes & Checks", href: "/collections/shirting-fabrics?pattern=stripes" },
      { label: "Formal White & Sky Blue Edits", href: "/collections/shirting-fabrics?color=white" },
    ],
  },
  "suiting-fabrics": {
    title: "Tailoring Cloth",
    desc: "Worsted wool, tweed, and formal evening suiting cloth.",
    items: [
      { label: "Super 120s – 150s Merino Wool", href: "/collections/suiting-fabrics?wool=merino" },
      { label: "All-Season Tropical Wool", href: "/collections/suiting-fabrics?type=tropical" },
      { label: "Wool-Silk & Linen Blends", href: "/collections/suiting-fabrics?blend=silk" },
      { label: "Herringbone, Birdseye & Houndstooth", href: "/collections/suiting-fabrics?weave=herringbone" },
      { label: "Tuxedo & Black-Tie Cloth", href: "/collections/suiting-fabrics?occasion=tuxedo" },
    ],
  },
  "exclusive-luxury-suiting": {
    title: "Master Reserve Cloth",
    desc: "Handpicked presidential cloth cuts and rare mill reserves.",
    items: [
      { label: "Super 180s Bespoke Wool", href: "/collections/exclusive-luxury-suiting?grade=super180" },
      { label: "Pure Mongolian Cashmere", href: "/collections/exclusive-luxury-suiting?fiber=cashmere" },
      { label: "Rare Escorial & Vicuña Cuts", href: "/collections/exclusive-luxury-suiting?rare=true" },
      { label: "Gold & Platinum Weave Series", href: "/collections/exclusive-luxury-suiting?series=platinum" },
    ],
  },
};

export default function Header({ categories, settings, onOpenSearch }: HeaderProps) {
  const pathname = usePathname();
  const { openCart, totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Default fabric categories if database categories not yet populated
  const displayCategories =
    categories.length > 0
      ? categories
      : [
          { id: "1", name: "Shirting Fabrics", slug: "shirting-fabrics", display_order: 1, is_active: true, is_nav_item: true, created_at: "", updated_at: "" },
          { id: "2", name: "Suiting Fabrics", slug: "suiting-fabrics", display_order: 2, is_active: true, is_nav_item: true, created_at: "", updated_at: "" },
          { id: "3", name: "Exclusive Luxury Suiting", slug: "exclusive-luxury-suiting", display_order: 3, is_active: true, is_nav_item: true, created_at: "", updated_at: "" },
          { id: "4", name: "Readymade", slug: "readymade", display_order: 4, is_active: true, is_nav_item: true, created_at: "", updated_at: "" },
          { id: "5", name: "Dhoti / Veshti", slug: "dhoti-veshti", display_order: 5, is_active: true, is_nav_item: true, created_at: "", updated_at: "" },
          { id: "6", name: "Accessories", slug: "accessories", display_order: 6, is_active: true, is_nav_item: true, created_at: "", updated_at: "" },
        ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 bg-white/98 backdrop-blur-md border-b ${
        isScrolled
          ? "border-beige-border shadow-sm h-18 sm:h-20"
          : "border-beige-border/70 h-20 sm:h-22"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full gap-4">
          
          {/* Mobile Menu Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-navy hover:text-gold transition-colors focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* Brand Logo - Perfectly centered vertically */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="inline-flex items-center group">
              <div className="relative w-36 sm:w-44 lg:w-48 h-11 sm:h-12 flex items-center">
                <Image
                  src="/fab-basic-logo.png"
                  alt={`${settings.site_name} - ${settings.tagline}`}
                  fill
                  priority
                  className="object-contain object-left transition-transform duration-300 group-hover:scale-[1.01]"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Center Navigation - Title Case, balanced spacing, dropdowns */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 h-full">
            {displayCategories.map((cat) => {
              const isActive = pathname === `/collections/${cat.slug}`;
              const submenu = CATEGORY_SUBMENUS[cat.slug];
              const isHovered = activeDropdown === cat.slug;

              return (
                <div
                  key={cat.id || cat.slug}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => submenu && setActiveDropdown(cat.slug)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={`/collections/${cat.slug}`}
                    className={`text-[13.5px] xl:text-[14px] font-medium transition-colors duration-200 py-2 flex items-center gap-1.5 whitespace-nowrap ${
                      isActive || isHovered
                        ? "text-gold font-semibold"
                        : "text-navy hover:text-gold"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {submenu && (
                      <ChevronDown
                        className={`w-3 h-3 text-charcoal/50 group-hover:text-gold transition-transform duration-200 ${
                          isHovered ? "rotate-180 text-gold" : ""
                        }`}
                      />
                    )}
                  </Link>

                  {/* Active Route Indicator Line */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold" />
                  )}

                  {/* Editorial Dropdown Menu */}
                  {submenu && isHovered && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 w-80 bg-white border border-beige-border shadow-xl rounded-b-sm p-5 z-50 animate-fade-in"
                      onMouseEnter={() => setActiveDropdown(cat.slug)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="border-b border-beige-border pb-3 mb-3">
                        <p className="text-[11px] font-semibold uppercase tracking-luxury text-gold">
                          {submenu.title}
                        </p>
                        <p className="text-xs text-charcoal/80 font-light mt-0.5">
                          {submenu.desc}
                        </p>
                      </div>

                      <div className="space-y-2">
                        {submenu.items.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="block text-xs text-navy hover:text-gold transition-colors py-1 hover:translate-x-1 duration-150"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>

                      <div className="pt-4 mt-3 border-t border-beige-border">
                        <Link
                          href={`/collections/${cat.slug}`}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-luxury text-navy hover:text-gold transition-colors"
                        >
                          <span>Explore All {cat.name}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Icons - Clean alignment with custom gold counter badges */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-navy hover:text-gold transition-colors relative flex items-center justify-center rounded-full hover:bg-beige-subtle/50"
              aria-label="Search fabric catalog"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Account / Admin Portal */}
            <Link
              href="/admin"
              className="p-2 text-navy hover:text-gold transition-colors hidden sm:flex items-center justify-center rounded-full hover:bg-beige-subtle/50"
              title="Admin Portal"
              aria-label="Admin Portal"
            >
              <User className="w-5 h-5 stroke-[1.5]" />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="p-2 text-navy hover:text-gold transition-colors relative flex items-center justify-center rounded-full hover:bg-beige-subtle/50"
              aria-label="View Saved Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {totalWishlistItems > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-gold text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Shopping Bag Trigger with Gold Badge */}
            <button
              onClick={openCart}
              className="p-2 text-navy hover:text-gold transition-colors relative flex items-center justify-center rounded-full hover:bg-beige-subtle/50"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-gold text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm">
                {totalItems}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy-deep/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-ivory shadow-2xl flex flex-col justify-between z-50 border-r border-beige-border animate-slide-right overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-beige-border bg-white">
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
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="px-5 py-6 space-y-6">
                <div>
                  <p className="text-[11px] uppercase tracking-luxury text-gold font-semibold mb-3">
                    Fabric Collections
                  </p>
                  <div className="space-y-1">
                    {displayCategories.map((cat) => (
                      <Link
                        key={cat.id || cat.slug}
                        href={`/collections/${cat.slug}`}
                        className="block text-sm font-medium text-navy hover:text-gold transition-colors py-2 border-b border-beige-border/40"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div>
                  <p className="text-[11px] uppercase tracking-luxury text-gold font-semibold mb-3">
                    Personal Wardrobe
                  </p>
                  <div className="space-y-2">
                    <Link
                      href="/wishlist"
                      className="flex items-center justify-between text-xs font-medium text-navy hover:text-gold transition-colors py-1.5"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-gold" />
                        <span>Saved Wishlist</span>
                      </span>
                      {totalWishlistItems > 0 && (
                        <span className="px-1.5 py-0.5 bg-gold text-white text-[10px] font-bold rounded-full">
                          {totalWishlistItems}
                        </span>
                      )}
                    </Link>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        openCart();
                      }}
                      className="w-full flex items-center justify-between text-xs font-medium text-navy hover:text-gold transition-colors py-1.5 text-left"
                    >
                      <span className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-gold" />
                        <span>Shopping Bag</span>
                      </span>
                      <span className="px-1.5 py-0.5 bg-navy text-white text-[10px] font-bold rounded-full">
                        {totalItems}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-beige-border space-y-2">
                  <Link
                    href="/about"
                    className="block text-xs text-charcoal hover:text-navy transition-colors py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Our Heritage &amp; Craft
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-xs text-charcoal hover:text-navy transition-colors py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Client Concierge &amp; Bespoke Inquiries
                  </Link>
                  <Link
                    href="/admin"
                    className="block text-xs text-gold hover:text-navy font-semibold transition-colors py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin CMS Login →
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer Contact */}
            <div className="p-5 border-t border-beige-border bg-beige-subtle/50 text-[11px] text-charcoal space-y-1">
              <p className="font-semibold text-navy uppercase tracking-luxury">
                {settings.site_name}
              </p>
              <p className="text-[10px] text-gold font-medium">{settings.tagline}</p>
              <p className="pt-1">{settings.contact_phone}</p>
              <p>{settings.contact_email}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
