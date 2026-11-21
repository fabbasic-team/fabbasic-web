"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Save,
  Check,
  Loader2,
  Globe,
  Shield,
  CreditCard,
  Mail,
  Upload,
  Sparkles,
  Scissors,
  Trash2,
  Crown,
} from "lucide-react";
import { StoreSettings, EditorialFeatureSettings, ExclusiveFeatureSettings } from "@/types";

const DEFAULT_EDITORIAL: EditorialFeatureSettings = {
  is_active: true,
  image_url: null,
  image_public_id: null,
  card_tag: "Bespoke Cloth House",
  card_title: "Precision in Every Metre. Elegance in Every Thread.",
  card_features: ["100% Certified Mills", "Pinking Shear Cut", "Heirloom Weaves"],
  eyebrow: "BESPOKE CRAFTSMANSHIP",
  heading: "The Art of Fine Fabric",
  text_1:
    "A bespoke garment is only as exceptional as the cloth from which it is cut. We handpick every bolt for its tactile drape, breathability, and natural longevity.",
  text_2:
    "Whether tailoring a sharp ceremonial two-piece or commissioning everyday executive shirting, our collection bridges European textile precision with Indian sartorial mastery.",
  cta_text: "Explore The Mill Archive",
  cta_link: "/collections",
};

const DEFAULT_EXCLUSIVE: ExclusiveFeatureSettings = {
  is_active: true,
  image_url: null,
  image_public_id: null,
  section_eyebrow: "EXCLUSIVE LUXURY SUITING",
  section_heading: "Beyond the Ordinary",
  section_subheading: "Discover exceptional fabrics selected for discerning tastes.",
  card_eyebrow: "Haute Tailoring Textiles",
  card_title: "Super 150s Worsted Wools, Cashmere Blends & Noble Silks",
  card_description:
    "Each cut in our exclusive collection is sourced directly from prestigious European and master Indian mills. Reserved for the pinnacle of bespoke suiting, ceremonial tuxedos, and tailored eveningwear.",
  cta_text: "Request Bespoke Fabric Swatches",
  cta_link: "/collections/exclusive-luxury-suiting",
  badge_title: "Atelier Suiting Cuts",
  badge_subtitle: "STITCH • STYLE • ELEGANCE",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Partial<StoreSettings>>({});
  const [editorial, setEditorial] = useState<EditorialFeatureSettings>(DEFAULT_EDITORIAL);
  const [exclusive, setExclusive] = useState<ExclusiveFeatureSettings>(DEFAULT_EXCLUSIVE);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [uploadingEditorialImage, setUploadingEditorialImage] = useState(false);
  const [uploadingExclusiveImage, setUploadingExclusiveImage] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
          if (data.settings.editorial_feature) {
            setEditorial({
              ...DEFAULT_EDITORIAL,
              ...data.settings.editorial_feature,
            });
          }
          if (data.settings.exclusive_feature) {
            setExclusive({
              ...DEFAULT_EXCLUSIVE,
              ...data.settings.exclusive_feature,
            });
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEditorialImageUpload = async (file: File) => {
    setUploadingEditorialImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "fab-basic/editorial");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setEditorial((prev) => ({
          ...prev,
          image_url: data.url,
          image_public_id: data.public_id,
        }));
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (err: any) {
      alert(err.message || "Upload error");
    } finally {
      setUploadingEditorialImage(false);
    }
  };

  const handleExclusiveImageUpload = async (file: File) => {
    setUploadingExclusiveImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "fab-basic/exclusive");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setExclusive((prev) => ({
          ...prev,
          image_url: data.url,
          image_public_id: data.public_id,
        }));
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (err: any) {
      alert(err.message || "Upload error");
    } finally {
      setUploadingExclusiveImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");

    try {
      const payload = {
        ...settings,
        editorial_feature: editorial,
        exclusive_feature: exclusive,
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus(null), 2500);
      } else {
        alert("Failed to save settings");
        setSaveStatus(null);
      }
    } catch {
      alert("Error saving settings");
      setSaveStatus(null);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold mb-2" />
        <span>Loading CMS settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif text-slate-900 font-light">
          Website CMS &amp; Store Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage announcements, editorial showcases, luxury suiting features, brand story, and store preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* SECTION 1: EDITORIAL FEATURE - THE ART OF FINE FABRIC */}
        <div id="editorial-feature" className="p-6 sm:p-7 bg-white border border-slate-200 rounded-xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
              <h2 className="text-lg font-serif text-slate-900 font-semibold tracking-tight">
                Featured Editorial Showcase (&ldquo;The Art of Fine Fabric&rdquo;)
              </h2>
            </div>
            
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={editorial.is_active}
                onChange={(e) => setEditorial({ ...editorial, is_active: e.target.checked })}
                className="w-4 h-4 text-navy rounded border-slate-300"
              />
              <span>Section Visible on Homepage</span>
            </label>
          </div>

          <p className="text-xs text-slate-500">
            Upload custom editorial photography and manage headlines, story copy, and call-to-action buttons for &ldquo;The Art of Fine Fabric&rdquo;.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Visual Column / Image Upload Preview (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <label className="block text-xs uppercase tracking-luxury font-semibold text-slate-700">
                Left Visual Card Cover Image
              </label>

              {editorial.image_url ? (
                <div className="relative aspect-[4/3] w-full rounded-lg border border-slate-200 overflow-hidden shadow-sm group">
                  <Image
                    src={editorial.image_url}
                    alt={editorial.card_title || "Editorial Card"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-navy-deep/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-slate-100 text-navy text-xs font-semibold rounded shadow flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-gold" />
                      <span>Change</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleEditorialImageUpload(e.target.files[0]);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditorial({ ...editorial, image_url: null, image_public_id: null })}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-dashed border-slate-300 hover:border-gold rounded-lg cursor-pointer bg-slate-50 transition-colors p-4 text-center">
                  {uploadingEditorialImage ? (
                    <div className="flex flex-col items-center gap-2 text-slate-500 text-xs">
                      <Loader2 className="w-6 h-6 animate-spin text-gold" />
                      <span className="font-medium">Uploading to Cloudinary...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500 text-xs">
                      <div className="w-10 h-10 rounded-full border border-gold/40 bg-white flex items-center justify-center text-gold shadow-xs">
                        <Upload className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <span className="font-semibold text-slate-800">Click to upload cover photo</span>
                      <span className="text-[10px] text-slate-400">Stores in Cloudinary &bull; High-res 4:3 landscape</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingEditorialImage}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleEditorialImageUpload(e.target.files[0]);
                    }}
                  />
                </label>
              )}

              {/* Card Badge & Title Inputs */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] uppercase tracking-luxury font-medium text-slate-600 mb-1">
                    Card Badge Tag
                  </label>
                  <input
                    type="text"
                    value={editorial.card_tag || ""}
                    onChange={(e) => setEditorial({ ...editorial, card_tag: e.target.value })}
                    placeholder="Bespoke Cloth House"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 text-xs rounded focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-luxury font-medium text-slate-600 mb-1">
                    Card Overlay Headline
                  </label>
                  <input
                    type="text"
                    value={editorial.card_title || ""}
                    onChange={(e) => setEditorial({ ...editorial, card_title: e.target.value })}
                    placeholder="Precision in Every Metre. Elegance in Every Thread."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 text-xs rounded focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-luxury font-medium text-slate-600 mb-1">
                    Card Features (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editorial.card_features?.join(", ") || ""}
                    onChange={(e) =>
                      setEditorial({
                        ...editorial,
                        card_features: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="100% Certified Mills, Pinking Shear Cut, Heirloom Weaves"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 text-xs rounded focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

            {/* Right Side Editorial Copy (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-luxury font-semibold text-slate-700 mb-1">
                  Small Eyebrow Label
                </label>
                <input
                  type="text"
                  value={editorial.eyebrow || ""}
                  onChange={(e) => setEditorial({ ...editorial, eyebrow: e.target.value })}
                  placeholder="BESPOKE CRAFTSMANSHIP"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-luxury font-semibold text-slate-700 mb-1">
                  Main Section Heading *
                </label>
                <input
                  type="text"
                  value={editorial.heading || ""}
                  onChange={(e) => setEditorial({ ...editorial, heading: e.target.value })}
                  placeholder="The Art of Fine Fabric"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded font-serif font-medium focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-luxury font-semibold text-slate-700 mb-1">
                  Paragraph 1
                </label>
                <textarea
                  rows={3}
                  value={editorial.text_1 || ""}
                  onChange={(e) => setEditorial({ ...editorial, text_1: e.target.value })}
                  placeholder="A bespoke garment is only as exceptional as the cloth from which it is cut..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-xs rounded focus:outline-none focus:border-gold leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-luxury font-semibold text-slate-700 mb-1">
                  Paragraph 2
                </label>
                <textarea
                  rows={3}
                  value={editorial.text_2 || ""}
                  onChange={(e) => setEditorial({ ...editorial, text_2: e.target.value })}
                  placeholder="Whether tailoring a sharp ceremonial two-piece..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-xs rounded focus:outline-none focus:border-gold leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-luxury font-semibold text-slate-700 mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={editorial.cta_text || ""}
                    onChange={(e) => setEditorial({ ...editorial, cta_text: e.target.value })}
                    placeholder="Explore The Mill Archive"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-xs rounded focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-luxury font-semibold text-slate-700 mb-1">
                    CTA Destination Link
                  </label>
                  <input
                    type="text"
                    value={editorial.cta_link || ""}
                    onChange={(e) => setEditorial({ ...editorial, cta_link: e.target.value })}
                    placeholder="/collections"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-xs rounded focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: EXCLUSIVE LUXURY SUITING - BEYOND THE ORDINARY */}
        <div id="exclusive-feature" className="p-6 sm:p-7 bg-white border border-slate-200 rounded-xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-gold" />
              <h2 className="text-lg font-serif text-slate-900 font-semibold tracking-tight">
                Exclusive Luxury Suiting Showcase (&ldquo;Beyond the Ordinary&rdquo;)
              </h2>
            </div>
            
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={exclusive.is_active}
                onChange={(e) => setExclusive({ ...exclusive, is_active: e.target.checked })}
                className="w-4 h-4 text-navy rounded border-slate-300"
              />
              <span>Section Visible on Homepage</span>
            </label>
          </div>

          <p className="text-xs text-slate-500">
            Customize the editorial suiting showcase, headlines, description copy, button CTA, and upload the right-hand atelier suiting cover image.
          </p>

          {/* Section Header Controls */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <span className="text-[11px] font-semibold uppercase tracking-luxury text-gold block">
              Section Header Details
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-luxury font-medium text-slate-600 mb-1">
                  Section Eyebrow
                </label>
                <input
                  type="text"
                  value={exclusive.section_eyebrow || ""}
                  onChange={(e) => setExclusive({ ...exclusive, section_eyebrow: e.target.value })}
                  placeholder="EXCLUSIVE LUXURY SUITING"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 text-xs rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-luxury font-medium text-slate-600 mb-1">
                  Section Title *
                </label>
                <input
                  type="text"
                  value={exclusive.section_heading || ""}
                  onChange={(e) => setExclusive({ ...exclusive, section_heading: e.target.value })}
                  placeholder="Beyond the Ordinary"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 text-xs font-serif rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-luxury font-medium text-slate-600 mb-1">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={exclusive.section_subheading || ""}
                  onChange={(e) => setExclusive({ ...exclusive, section_subheading: e.target.value })}
                  placeholder="Discover exceptional fabrics selected for discerning tastes."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 text-xs rounded focus:outline-none focus:border-gold"
                />
              </div>
            </div>
          </div>

          {/* Atmosphere Showcase Content & Right Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
            
            {/* Left Card Copy (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase tracking-luxury font-semibold text-slate-700 block">
                Atmosphere Story Card
              </span>

              <div>
                <label className="block text-[11px] uppercase tracking-luxury font-medium text-slate-600 mb-1">
                  Card Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={exclusive.card_eyebrow || ""}
                  onChange={(e) => setExclusive({ ...exclusive, card_eyebrow: e.target.value })}
                  placeholder="Haute Tailoring Textiles"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-xs rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-luxury font-medium text-slate-600 mb-1">
                  Card Headline Title *
                </label>
                <input
                  type="text"
                  value={exclusive.card_title || ""}
                  onChange={(e) => setExclusive({ ...exclusive, card_title: e.target.value })}
                  placeholder="Super 150s Worsted Wools, Cashmere Blends & Noble Silks"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm font-serif rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-luxury font-medium text-slate-600 mb-1">
                  Card Story Description
                </label>
                <textarea
                  rows={4}
                  value={exclusive.card_description || ""}
                  onChange={(e) => setExclusive({ ...exclusive, card_description: e.target.value })}
                  placeholder="Each cut in our exclusive collection is sourced directly from prestigious European and master Indian mills..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-xs rounded focus:outline-none focus:border-gold leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-luxury font-medium text-slate-600 mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={exclusive.cta_text || ""}
                    onChange={(e) => setExclusive({ ...exclusive, cta_text: e.target.value })}
                    placeholder="Request Bespoke Fabric Swatches"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-xs rounded focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-luxury font-medium text-slate-600 mb-1">
                    CTA Destination Link
                  </label>
                  <input
                    type="text"
                    value={exclusive.cta_link || ""}
                    onChange={(e) => setExclusive({ ...exclusive, cta_link: e.target.value })}
                    placeholder="/collections/exclusive-luxury-suiting"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-xs rounded focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

            {/* Right Visual Card Image Uploader (5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <label className="block text-xs uppercase tracking-luxury font-semibold text-slate-700">
                Right Atelier Visual Card Image
              </label>

              {exclusive.image_url ? (
                <div className="relative aspect-[4/3] w-full rounded-lg border border-slate-200 overflow-hidden shadow-sm group">
                  <Image
                    src={exclusive.image_url}
                    alt={exclusive.badge_title || "Atelier Suiting"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-navy-deep/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="cursor-pointer px-3 py-1.5 bg-white hover:bg-slate-100 text-navy text-xs font-semibold rounded shadow flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-gold" />
                      <span>Change</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleExclusiveImageUpload(e.target.files[0]);
                        }}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setExclusive({ ...exclusive, image_url: null, image_public_id: null })}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-[4/3] border-2 border-dashed border-slate-300 hover:border-gold rounded-lg cursor-pointer bg-slate-50 transition-colors p-4 text-center">
                  {uploadingExclusiveImage ? (
                    <div className="flex flex-col items-center gap-2 text-slate-500 text-xs">
                      <Loader2 className="w-6 h-6 animate-spin text-gold" />
                      <span className="font-medium">Uploading to Cloudinary...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-500 text-xs">
                      <div className="w-10 h-10 rounded-full border border-gold/40 bg-white flex items-center justify-center text-gold shadow-xs">
                        <Upload className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <span className="font-semibold text-slate-800">Click to upload suiting photo</span>
                      <span className="text-[10px] text-slate-400">Stores in Cloudinary &bull; High-res 4:3 suiting cloth</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingExclusiveImage}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleExclusiveImageUpload(e.target.files[0]);
                    }}
                  />
                </label>
              )}

              {/* Right Card Overlay Badge Details */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] uppercase tracking-luxury font-medium text-slate-600 mb-1">
                    Badge Title
                  </label>
                  <input
                    type="text"
                    value={exclusive.badge_title || ""}
                    onChange={(e) => setExclusive({ ...exclusive, badge_title: e.target.value })}
                    placeholder="Atelier Suiting Cuts"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 text-xs rounded focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-luxury font-medium text-slate-600 mb-1">
                    Badge Subtitle
                  </label>
                  <input
                    type="text"
                    value={exclusive.badge_subtitle || ""}
                    onChange={(e) => setExclusive({ ...exclusive, badge_subtitle: e.target.value })}
                    placeholder="STITCH • STYLE • ELEGANCE"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 text-xs rounded focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 3: ANNOUNCEMENT BAR */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Globe className="w-5 h-5 text-gold" />
            <h2 className="text-base font-semibold text-slate-900">
              Storefront Announcement Bar
            </h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.announcement_active ?? true}
                onChange={(e) =>
                  setSettings({ ...settings, announcement_active: e.target.checked })
                }
                className="w-4 h-4 text-navy rounded border-slate-300"
              />
              <span>Enable Announcement Bar on Storefront</span>
            </label>

            <div>
              <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                Announcement Message Text
              </label>
              <input
                type="text"
                value={settings.announcement_text || ""}
                onChange={(e) =>
                  setSettings({ ...settings, announcement_text: e.target.value })
                }
                placeholder="New Season Fabrics | Discover our latest collection"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                Announcement Destination Link
              </label>
              <input
                type="text"
                value={settings.announcement_link || ""}
                onChange={(e) =>
                  setSettings({ ...settings, announcement_link: e.target.value })
                }
                placeholder="/collections"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: BRAND STORY SECTION */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Shield className="w-5 h-5 text-gold" />
            <h2 className="text-base font-semibold text-slate-900">
              Brand Story Section (&ldquo;A Tradition of Style. A Standard of Quality.&rdquo;)
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                Story Heading
              </label>
              <input
                type="text"
                value={settings.brand_story_heading || ""}
                onChange={(e) =>
                  setSettings({ ...settings, brand_story_heading: e.target.value })
                }
                placeholder="A Tradition of Style. A Standard of Quality."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                Story Subtitle
              </label>
              <input
                type="text"
                value={settings.brand_story_subheading || ""}
                onChange={(e) =>
                  setSettings({ ...settings, brand_story_subheading: e.target.value })
                }
                placeholder="Curated by Master Clothiers"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                Story Body Text
              </label>
              <textarea
                rows={3}
                value={settings.brand_story_text || ""}
                onChange={(e) =>
                  setSettings({ ...settings, brand_story_text: e.target.value })
                }
                placeholder="At FAB BASIC, we believe tailoring begins with extraordinary cloth..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: CONTACT & CONCIERGE INFORMATION */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Mail className="w-5 h-5 text-gold" />
            <h2 className="text-base font-semibold text-slate-900">
              Client Care &amp; Contact Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={settings.contact_email || ""}
                onChange={(e) =>
                  setSettings({ ...settings, contact_email: e.target.value })
                }
                placeholder="care@fabbasic.com"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                Tailoring Phone
              </label>
              <input
                type="text"
                value={settings.contact_phone || ""}
                onChange={(e) =>
                  setSettings({ ...settings, contact_phone: e.target.value })
                }
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                WhatsApp Concierge Number
              </label>
              <input
                type="text"
                value={settings.whatsapp_number || ""}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp_number: e.target.value })
                }
                placeholder="+919876543210"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                Instagram URL
              </label>
              <input
                type="text"
                value={settings.instagram_url || ""}
                onChange={(e) =>
                  setSettings({ ...settings, instagram_url: e.target.value })
                }
                placeholder="https://instagram.com/fabbasic"
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* SECTION 6: SHIPPING THRESHOLDS */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <CreditCard className="w-5 h-5 text-gold" />
            <h2 className="text-base font-semibold text-slate-900">
              Shipping &amp; Delivery Thresholds
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={settings.free_shipping_threshold || 2999}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    free_shipping_threshold: parseFloat(e.target.value) || 2999,
                  })
                }
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                Standard Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={settings.standard_shipping_fee || 199}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    standard_shipping_fee: parseFloat(e.target.value) || 199,
                  })
                }
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end sticky bottom-6 z-20">
          <button
            type="submit"
            disabled={saveStatus === "saving"}
            className="px-8 py-3.5 bg-navy hover:bg-navy-deep text-white text-xs uppercase tracking-luxury font-bold rounded shadow-xl flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-gold" />
                <span>Saving All CMS Settings...</span>
              </>
            ) : saveStatus === "success" ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Settings Saved Successfully!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-gold" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
