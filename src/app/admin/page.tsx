"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Scissors,
  Image as ImageIcon,
  FolderTree,
  ShoppingBag,
  IndianRupee,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  ArrowRight,
  Plus,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [tablesReady, setTablesReady] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [stats, setStats] = useState({
    productsCount: 0,
    categoriesCount: 0,
    bannersCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
    pendingOrdersCount: 0,
  });

  const checkStatus = async () => {
    try {
      const res = await fetch("/api/admin/status");
      if (res.ok) {
        const data = await res.json();
        setTablesReady(data.tablesReady);
        setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleCopySql = async () => {
    try {
      const res = await fetch("/supabase/migrations/20261121000000_fab_basic_init.sql");
      const sqlText = await res.text();
      await navigator.clipboard.writeText(sqlText);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
    } catch {
      alert("Could not copy automatically. You can copy the SQL from supabase/migrations folder.");
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-slate-900 font-light">
            Editorial Commerce Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage FAB BASIC fabrics, campaign banners, orders, and storefront content.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2 bg-navy hover:bg-navy-deep text-white text-xs uppercase tracking-luxury font-semibold rounded shadow transition-colors"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Add Fabric</span>
          </Link>
          <Link
            href="/admin/banners"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold hover:bg-gold-hover text-navy text-xs uppercase tracking-luxury font-bold rounded shadow transition-colors"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Hero Banners</span>
          </Link>
        </div>
      </div>

      {/* Database Connection & Setup Status Banner */}
      {!loading && !tablesReady && (
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-base font-semibold text-amber-900">
                Supabase Tables Initialization Required
              </h3>
              <p className="text-sm text-amber-800 mt-1">
                Your Supabase project (<code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded text-xs font-bold">vdkyaxjtmhinmadsfzyp</code>) is connected! Run the database schema migration to activate live products, categories, orders, and banners.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800 block mb-1">
                Step-by-step 15-second setup:
              </span>
              <ol className="list-decimal list-inside space-y-1">
                <li>Click <strong>&quot;Copy SQL Migration&quot;</strong> below</li>
                <li>Go to Supabase Dashboard &gt; SQL Editor (<a href="https://supabase.com/dashboard/project/vdkyaxjtmhinmadsfzyp/sql/new" target="_blank" rel="noreferrer" className="text-blue-600 underline">open directly ↗</a>)</li>
                <li>Paste the SQL script and click <strong>&quot;Run&quot;</strong></li>
              </ol>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCopySql}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded flex items-center gap-2 transition-colors shadow"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>SQL Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy SQL Migration</span>
                  </>
                )}
              </button>
              <button
                onClick={checkStatus}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded transition-colors"
              >
                Check Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Products */}
        <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Fabric Products
            </span>
            <Scissors className="w-5 h-5 text-gold" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.productsCount}</p>
          <Link
            href="/admin/products"
            className="text-[11px] text-blue-600 hover:underline mt-2 inline-block font-medium"
          >
            Manage inventory →
          </Link>
        </div>

        {/* Hero Banners */}
        <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Hero Banners
            </span>
            <ImageIcon className="w-5 h-5 text-gold" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.bannersCount} / 3</p>
          <Link
            href="/admin/banners"
            className="text-[11px] text-blue-600 hover:underline mt-2 inline-block font-medium"
          >
            Configure slides →
          </Link>
        </div>

        {/* Categories */}
        <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Categories
            </span>
            <FolderTree className="w-5 h-5 text-gold" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.categoriesCount}</p>
          <Link
            href="/admin/categories"
            className="text-[11px] text-blue-600 hover:underline mt-2 inline-block font-medium"
          >
            Manage collections →
          </Link>
        </div>

        {/* Orders */}
        <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Orders
            </span>
            <ShoppingBag className="w-5 h-5 text-gold" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.ordersCount}</p>
          <Link
            href="/admin/orders"
            className="text-[11px] text-blue-600 hover:underline mt-2 inline-block font-medium"
          >
            Review orders →
          </Link>
        </div>

        {/* Revenue */}
        <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Verified Revenue
            </span>
            <IndianRupee className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900">
            ₹{stats.totalRevenue.toLocaleString("en-IN")}
          </p>
          <span className="text-[11px] text-slate-400 mt-2 block">
            Via Razorpay gateway
          </span>
        </div>

        {/* Pending Shipments */}
        <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Shipments
            </span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900">{stats.pendingOrdersCount}</p>
          <Link
            href="/admin/orders"
            className="text-[11px] text-blue-600 hover:underline mt-2 inline-block font-medium"
          >
            Update fulfillment →
          </Link>
        </div>

      </div>

      {/* Quick Access Control Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Module 1: Categories / Explore Our Collections */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4 hover:border-gold/60 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-navy/5 text-navy flex items-center justify-center">
            <FolderTree className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Homepage Collections</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              1-click upload cover photography for the 6 primary homepage collections: Shirting, Suiting, Luxury Suiting, Readymade, Dhoti/Veshti, and Accessories.
            </p>
          </div>
          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-gold uppercase tracking-luxury transition-colors"
          >
            <span>Upload 6 Collection Covers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Module 2: Hero Banners */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4 hover:border-gold/60 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-navy/5 text-navy flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Hero Carousel Banners</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Upload up to 3 campaign slides with separate desktop and mobile portrait images directly to Cloudinary. Configure headlines, CTA links, and overlay darkness.
            </p>
          </div>
          <Link
            href="/admin/banners"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-gold uppercase tracking-luxury transition-colors"
          >
            <span>Manage 3 Hero Slides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Module 3: Products */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4 hover:border-gold/60 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-navy/5 text-navy flex items-center justify-center">
            <Scissors className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Fabric Products &amp; Metres</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Publish real textiles, specify price per metre, custom minimum cuts (e.g. 1.0m, 2.5m), composition (Egyptian Giza cotton, Super 130s wool), and upload Cloudinary imagery.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-gold uppercase tracking-luxury transition-colors"
          >
            <span>Add / Edit Fabrics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Module 4: CMS & Settings */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4 hover:border-gold/60 transition-colors">
          <div className="w-10 h-10 rounded-lg bg-navy/5 text-navy flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Website CMS &amp; Settings</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Change the announcement bar text and active toggle, brand story text, contact details, social links, return policy, and payment credentials.
            </p>
          </div>
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy hover:text-gold uppercase tracking-luxury transition-colors"
          >
            <span>Configure Store Settings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

    </div>
  );
}
