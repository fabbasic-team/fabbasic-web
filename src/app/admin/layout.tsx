"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  FolderTree,
  Scissors,
  ShoppingBag,
  Sliders,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, don't show the admin dashboard shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const navItems = [
    {
      name: "Dashboard Overview",
      href: "/admin",
      icon: LayoutDashboard,
      description: "KPI stats & database status",
    },
    {
      name: "Hero Banners",
      href: "/admin/banners",
      icon: ImageIcon,
      description: "Manage up to 3 campaign slides",
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: FolderTree,
      description: "Navigation & collection groups",
    },
    {
      name: "Fabric Products",
      href: "/admin/products",
      icon: Scissors,
      description: "Textiles, metres, widths, colors",
    },
    {
      name: "Customer Orders",
      href: "/admin/orders",
      icon: ShoppingBag,
      description: "Fulfillment & tracking updates",
    },
    {
      name: "Website CMS & Settings",
      href: "/admin/settings",
      icon: Sliders,
      description: "Announcement bar, policies, story",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800 font-sans">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-navy-deep text-ivory p-4 flex items-center justify-between border-b border-navy-light">
        <div className="relative w-36 h-9">
          <Image
            src="/fab-basic-logo.png"
            alt="FAB BASIC Admin"
            fill
            className="object-contain object-left brightness-0 invert"
          />
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-ivory hover:text-gold transition-colors"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-navy-deep text-ivory flex flex-col justify-between border-r border-navy-light/60 transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-navy-light/40">
            <div className="relative w-44 h-12">
              <Image
                src="/fab-basic-logo.png"
                alt="FAB BASIC"
                fill
                priority
                className="object-contain object-left brightness-0 invert"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-luxury text-gold font-bold">
                MANAGEMENT SUITE
              </span>
              <span className="px-2 py-0.5 bg-gold/20 text-gold text-[10px] rounded font-mono font-medium">
                v1.0 Pro
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-start gap-3.5 px-3.5 py-3 rounded text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-gold text-navy font-semibold shadow-md"
                      : "text-ivory/80 hover:bg-navy-surface hover:text-ivory"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      isActive ? "text-navy stroke-[2.2]" : "text-gold"
                    }`}
                  />
                  <div>
                    <span className="block">{item.name}</span>
                    <span
                      className={`text-[11px] block leading-tight ${
                        isActive ? "text-navy/70" : "text-ivory/40"
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-navy-light/40 space-y-2 bg-navy-surface/40">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded text-xs text-ivory/80 hover:bg-navy-surface hover:text-gold transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-gold" />
              <span>View Live Storefront</span>
            </span>
            <span className="text-[10px] text-ivory/40">↗</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded text-xs text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out (najmal@fabbasic.com)</span>
          </button>
        </div>
      </aside>

      {/* Main Administrative Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Top Desktop Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              FAB BASIC Editorial Commerce System
            </h2>
            <p className="text-xs text-slate-500">
              Connected to Supabase PostgreSQL &amp; Cloudinary CDN
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="text-right pl-4 border-l border-slate-200">
              <span className="text-xs font-semibold text-slate-800 block">
                najmal@fabbasic.com
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">
                Super Administrator
              </span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
