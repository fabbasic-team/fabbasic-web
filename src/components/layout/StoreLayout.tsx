"use client";

import React, { useState } from "react";
import AnnouncementBar from "./AnnouncementBar";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "../cart/CartDrawer";
import SearchModal from "../search/SearchModal";
import { StoreSettings, Category } from "@/types";

interface StoreLayoutProps {
  children: React.ReactNode;
  settings: StoreSettings;
  categories: Category[];
}

export default function StoreLayout({ children, settings, categories }: StoreLayoutProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-navy selection:bg-gold selection:text-white">
      {/* Announcement Bar */}
      <AnnouncementBar settings={settings} />

      {/* Main Header */}
      <Header
        settings={settings}
        categories={categories}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <Footer settings={settings} categories={categories} />

      {/* Slide-Out Shopping Bag Drawer */}
      <CartDrawer />

      {/* Search Overlay Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
