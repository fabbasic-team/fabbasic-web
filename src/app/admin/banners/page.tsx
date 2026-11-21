"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Upload,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Loader2,
  Eye,
  Sliders,
  Smartphone,
  Monitor,
} from "lucide-react";
import { HomepageBanner } from "@/types";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<HomepageBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Partial<HomepageBanner> | null>(null);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const fetchBanners = async () => {
    try {
      const res = await fetch("/api/admin/banners");
      if (res.ok) {
        const data = await res.json();
        setBanners(data.banners || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileUpload = async (file: File, type: "desktop" | "mobile") => {
    if (type === "desktop") setUploadingDesktop(true);
    else setUploadingMobile(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "folder",
        type === "desktop" ? "fab-basic/banners/desktop" : "fab-basic/banners/mobile"
      );

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setEditingBanner((prev) => ({
          ...prev,
          ...(type === "desktop"
            ? {
                desktop_image_url: data.url,
                desktop_image_public_id: data.public_id,
              }
            : {
                mobile_image_url: data.url,
                mobile_image_public_id: data.public_id,
              }),
        }));
      } else {
        alert(data.error || "Failed to upload image to Cloudinary");
      }
    } catch (err: any) {
      alert(err.message || "Upload error");
    } finally {
      if (type === "desktop") setUploadingDesktop(false);
      else setUploadingMobile(false);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner?.desktop_image_url) {
      alert("Please upload at least the desktop hero banner image.");
      return;
    }

    setSaveStatus("saving");

    try {
      const method = editingBanner.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/banners", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingBanner),
      });

      const data = await res.json();
      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => {
          setSaveStatus(null);
          setIsEditing(false);
          setEditingBanner(null);
          fetchBanners();
        }, 800);
      } else {
        alert(data.error || "Failed to save banner");
        setSaveStatus(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to save banner");
      setSaveStatus(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this hero banner?")) return;

    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchBanners();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete");
      }
    } catch (err: any) {
      alert(err.message || "Error deleting banner");
    }
  };

  const openCreateModal = () => {
    setEditingBanner({
      title: "",
      eyebrow: "THE FABRIC EDIT",
      subtitle: "",
      cta_text: "Shop the Collection",
      cta_link: "/collections",
      text_alignment: "left",
      overlay_intensity: 45,
      display_order: banners.length + 1,
      is_active: true,
    });
    setIsEditing(true);
  };

  const openEditModal = (b: HomepageBanner) => {
    setEditingBanner(b);
    setIsEditing(true);
  };

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-slate-900 font-light">
            Homepage Hero Banners (Max 3)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure campaign slides with separate desktop landscape and mobile portrait images stored on Cloudinary.
          </p>
        </div>

        {banners.length < 3 && !isEditing && (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy hover:bg-navy-deep text-white text-xs uppercase tracking-luxury font-semibold rounded shadow transition-colors"
          >
            <Plus className="w-4 h-4 text-gold" />
            <span>Add Banner ({banners.length}/3)</span>
          </button>
        )}
      </div>

      {/* Editor Form Modal / View */}
      {isEditing && editingBanner && (
        <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-lg shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-lg font-serif text-slate-900 font-normal">
              {editingBanner.id ? "Edit Campaign Banner" : "New Campaign Banner"}
            </h2>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingBanner(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveBanner} className="space-y-6">
            
            {/* Image Upload Grid: Desktop & Mobile Separate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Desktop Image */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-luxury font-semibold text-slate-700 flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-gold" />
                  <span>Desktop Banner Image (1920x800 recommended) *</span>
                </label>

                {editingBanner.desktop_image_url ? (
                  <div className="relative aspect-[16/7] w-full bg-slate-100 rounded border border-slate-200 overflow-hidden group">
                    <Image
                      src={editingBanner.desktop_image_url}
                      alt="Desktop Banner"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer px-3 py-1.5 bg-white text-slate-800 text-xs font-semibold rounded shadow">
                        Change Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(e.target.files[0], "desktop");
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-[16/7] w-full border-2 border-dashed border-slate-300 hover:border-gold rounded cursor-pointer bg-slate-50 transition-colors">
                    {uploadingDesktop ? (
                      <div className="flex flex-col items-center gap-2 text-slate-500">
                        <Loader2 className="w-6 h-6 animate-spin text-gold" />
                        <span className="text-xs">Uploading to Cloudinary...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-500">
                        <Upload className="w-6 h-6 text-gold" />
                        <span className="text-xs font-medium">Click to upload Desktop Banner</span>
                        <span className="text-[10px] text-slate-400">High-res landscape photography</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(e.target.files[0], "desktop");
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Mobile Image */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-luxury font-semibold text-slate-700 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-gold" />
                  <span>Mobile Banner Image (800x1000 portrait)</span>
                </label>

                {editingBanner.mobile_image_url ? (
                  <div className="relative aspect-[16/7] md:aspect-[16/7] w-full bg-slate-100 rounded border border-slate-200 overflow-hidden group">
                    <Image
                      src={editingBanner.mobile_image_url}
                      alt="Mobile Banner"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer px-3 py-1.5 bg-white text-slate-800 text-xs font-semibold rounded shadow">
                        Change Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(e.target.files[0], "mobile");
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center aspect-[16/7] w-full border-2 border-dashed border-slate-300 hover:border-gold rounded cursor-pointer bg-slate-50 transition-colors">
                    {uploadingMobile ? (
                      <div className="flex flex-col items-center gap-2 text-slate-500">
                        <Loader2 className="w-6 h-6 animate-spin text-gold" />
                        <span className="text-xs">Uploading to Cloudinary...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-500">
                        <Upload className="w-6 h-6 text-gold" />
                        <span className="text-xs font-medium">Click to upload Mobile Banner</span>
                        <span className="text-[10px] text-slate-400">Portrait crop for smartphones</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleFileUpload(e.target.files[0], "mobile");
                        }
                      }}
                    />
                  </label>
                )}
              </div>

            </div>

            {/* Typography & Copy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                  Small Eyebrow Label
                </label>
                <input
                  type="text"
                  value={editingBanner.eyebrow || ""}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, eyebrow: e.target.value })
                  }
                  placeholder="e.g. THE FABRIC EDIT"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                  Slide Heading (Title) *
                </label>
                <input
                  type="text"
                  value={editingBanner.title || ""}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, title: e.target.value })
                  }
                  required
                  placeholder="e.g. Refined Fabrics for Modern Tailoring"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                  Slide Subtitle / Description
                </label>
                <input
                  type="text"
                  value={editingBanner.subtitle || ""}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, subtitle: e.target.value })
                  }
                  placeholder="e.g. A curated range of shirting and suiting fabrics for every occasion."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={editingBanner.cta_text || ""}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, cta_text: e.target.value })
                  }
                  placeholder="Shop the Collection"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                  CTA Destination URL
                </label>
                <input
                  type="text"
                  value={editingBanner.cta_link || ""}
                  onChange={(e) =>
                    setEditingBanner({ ...editingBanner, cta_link: e.target.value })
                  }
                  placeholder="/collections/suiting-fabrics"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                  Text Alignment
                </label>
                <select
                  value={editingBanner.text_alignment || "left"}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      text_alignment: e.target.value as any,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                >
                  <option value="left">Left Aligned</option>
                  <option value="center">Centered</option>
                  <option value="right">Right Aligned</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={editingBanner.display_order || 1}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      display_order: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                  Overlay Darkness ({editingBanner.overlay_intensity ?? 45}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={editingBanner.overlay_intensity ?? 45}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      overlay_intensity: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-navy"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editingBanner.is_active ?? true}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      is_active: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-navy rounded border-slate-300"
                />
                <label htmlFor="is_active" className="text-xs font-semibold text-slate-800">
                  Slide is Active &amp; Visible on Storefront
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingBanner(null);
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-medium rounded hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveStatus === "saving"}
                className="px-6 py-2 bg-navy hover:bg-navy-deep text-white text-xs uppercase tracking-luxury font-semibold rounded shadow flex items-center gap-2"
              >
                {saveStatus === "saving" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-gold" />
                    <span>Saving...</span>
                  </>
                ) : saveStatus === "success" ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Slide</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banner Cards List */}
      <div className="space-y-4">
        {banners.length === 0 && !loading && (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-lg space-y-3">
            <p className="text-base font-serif text-slate-800">No Banners Published Yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add up to 3 campaign banners. The storefront will automatically display these with smooth luxury transitions.
            </p>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-gold hover:bg-gold-hover text-navy text-xs uppercase tracking-luxury font-bold rounded shadow transition-colors"
            >
              Add First Banner
            </button>
          </div>
        )}

        {banners.map((b) => (
          <div
            key={b.id}
            className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            {/* Thumbnail Preview */}
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-16 bg-slate-100 rounded border border-slate-200 overflow-hidden flex-shrink-0">
                <Image
                  src={b.desktop_image_url}
                  alt={b.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-gold">
                    Slide #{b.display_order}
                  </span>
                  {b.is_active ? (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-semibold rounded border border-emerald-200">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded">
                      Disabled
                    </span>
                  )}
                </div>
                <h3 className="text-base font-serif text-slate-900 font-medium mt-0.5">
                  {b.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">{b.subtitle}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={() => openEditModal(b)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(b.id)}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
