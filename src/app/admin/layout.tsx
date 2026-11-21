"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If on login page, don't show the admin dashboard shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      window.location.href = "/admin/login";
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
      description: "Editorial feature, story, contacts",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row text-slate-800 font-sans">
      
      {/* Mobile Top Header - Clean White Surface */}
      <div className="lg:hidden bg-white text-slate-900 p-4 flex items-center justify-between border-b border-slate-200 shadow-xs z-30">
        <div className="relative w-36 h-9">
          <Image
            src="/fab_basic_logo_transparent.png"
            alt="FAB BASIC Admin"
            fill
            priority
            className="object-contain object-left"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Direct Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded transition-colors"
            title="Log Out"
            aria-label="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>

          {/* Menu Drawer Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-700 hover:text-navy transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation - Executive Light Theme with Seamless Transparent Logo */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white text-slate-800 flex flex-col justify-between border-r border-slate-200 shadow-sm transition-transform duration-300 lg:translate-x-0 lg:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo & Brand Header */}
          <div className="p-6 border-b border-slate-200">
            <div className="relative w-44 h-12">
              <Image
                src="/fab_basic_logo_transparent.png"
                alt="FAB BASIC"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-luxury text-gold font-bold">
                MANAGEMENT SUITE
              </span>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-mono font-medium border border-slate-200">
                v1.0 Pro
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-start gap-3.5 px-3.5 py-3 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-navy text-gold font-semibold shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      isActive ? "text-gold stroke-[2.2]" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <div>
                    <span className="block">{item.name}</span>
                    <span
                      className={`text-[11px] block leading-tight ${
                        isActive ? "text-gold/75" : "text-slate-400"
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
        <div className="p-4 border-t border-slate-200 space-y-2.5 bg-slate-50/80">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs text-slate-600 hover:bg-white hover:text-navy border border-transparent hover:border-slate-200 transition-all"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-gold" />
              <span className="font-medium">View Live Storefront</span>
            </span>
            <span className="text-[10px] text-slate-400">↗</span>
          </Link>

          {/* Prominent Sidebar Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-md text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-2xs cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Sign Out / Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Administrative Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Top Desktop Bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-xs">
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
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors"
            >
              <span>View Store</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="text-right pl-3 border-l border-slate-200">
              <span className="text-xs font-semibold text-slate-800 block">
                Administrator
              </span>
              <span className="text-[10px] text-emerald-600 font-medium">
                Active Session
              </span>
            </div>

            {/* Prominent Desktop Header Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 text-xs font-semibold rounded-md border border-rose-200 transition-colors shadow-2xs cursor-pointer ml-1"
              title="Sign Out of Management Suite"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
