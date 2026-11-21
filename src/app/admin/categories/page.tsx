"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Loader2,
  Check,
  FolderTree,
  Sparkles,
  ExternalLink,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1-Click Direct Upload for the Homepage Showcase
  const handleDirectUpload = async (categoryId: string, file: File) => {
    setUploadingId(categoryId);
    try {
      // 1. Upload to Cloudinary via server API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "fab-basic/categories");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || "Failed to upload image to Cloudinary");
      }

      // 2. Update category record in Supabase
      const updateRes = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: categoryId,
          image_url: uploadData.url,
          image_public_id: uploadData.public_id,
        }),
      });

      if (!updateRes.ok) {
        const errData = await updateRes.json();
        throw new Error(errData.error || "Failed to update category record");
      }

      // 3. Update local state
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? { ...c, image_url: uploadData.url, image_public_id: uploadData.public_id }
            : c
        )
      );

      showToast("✓ Cover photo uploaded and updated live on homepage!");
    } catch (err: any) {
      alert(err.message || "Upload failed. Please try again.");
    } finally {
      setUploadingId(null);
    }
  };

  // Remove photo from category
  const handleRemovePhoto = async (categoryId: string) => {
    if (!confirm("Are you sure you want to remove this category photo?")) return;

    setUploadingId(categoryId);
    try {
      const updateRes = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: categoryId,
          image_url: null,
          image_public_id: null,
        }),
      });

      if (!updateRes.ok) throw new Error("Failed to clear category image");

      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryId
            ? { ...c, image_url: null, image_public_id: null }
            : c
        )
      );
      showToast("Photo removed. Homepage will show the elegant woven swatch fallback.");
    } catch (err: any) {
      alert(err.message || "Failed to remove photo.");
    } finally {
      setUploadingId(null);
    }
  };

  const handleModalImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "fab-basic/categories");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setEditingCategory((prev) => ({
          ...prev,
          image_url: data.url,
          image_public_id: data.public_id,
        }));
      } else {
        alert(data.error || "Failed to upload category image");
      }
    } catch (err: any) {
      alert(err.message || "Upload error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;

    setSaveStatus("saving");

    try {
      const method = editingCategory.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCategory),
      });

      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => {
          setSaveStatus(null);
          setIsEditing(false);
          setEditingCategory(null);
          fetchCategories();
        }, 800);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save category");
        setSaveStatus(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to save category");
      setSaveStatus(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete");
      }
    } catch (err: any) {
      alert(err.message || "Delete error");
    }
  };

  // Primary 6 categories for homepage showcase
  const primaryShowcase = categories.slice(0, 6);

  return (
    <div className="space-y-8">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-navy text-white px-5 py-3 rounded-lg shadow-2xl border border-gold/40 flex items-center gap-3 animate-slide-left">
          <Check className="w-5 h-5 text-gold flex-shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-slate-900 font-light">
            Collections &amp; Categories
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage fabric collections and 1-click upload cover photography for the homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded hover:bg-slate-100 transition-colors"
          >
            <span>View Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {!isEditing && (
            <button
              onClick={() => {
                setEditingCategory({
                  name: "",
                  slug: "",
                  description: "",
                  display_order: categories.length + 1,
                  is_active: true,
                  is_nav_item: true,
                });
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-navy hover:bg-navy-deep text-white text-xs uppercase tracking-luxury font-semibold rounded shadow transition-colors"
            >
              <Plus className="w-4 h-4 text-gold" />
              <span>Add Custom Category</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: 1-CLICK HOMEPAGE 6-CATEGORY COVER UPLOADER */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
              <h2 className="text-lg font-serif text-slate-900 font-semibold tracking-tight">
                Homepage Collection Showcase (&ldquo;Explore Our Collections&rdquo;)
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Directly upload cover photography for the 6 primary homepage collection cards. Each image is stored in Cloudinary and immediately published live on the homepage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-gold/10 text-gold-muted border border-gold/30 px-3 py-1 rounded-full font-medium">
              {categories.filter((c) => c.image_url).length} of {primaryShowcase.length} Photos Uploaded
            </span>
            <button
              onClick={fetchCategories}
              className="p-1.5 text-slate-400 hover:text-navy rounded transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 6 Category Showcase Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {primaryShowcase.map((cat) => {
            const isUploading = uploadingId === cat.id;

            return (
              <div
                key={cat.id}
                className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between space-y-3 hover:border-gold/60 hover:shadow-md transition-all group"
              >
                {/* Photo Preview Box (4:5 Aspect Ratio matching homepage) */}
                <div className="relative aspect-[4/5] w-full bg-white rounded overflow-hidden border border-slate-200 flex items-center justify-center">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-center text-slate-400 space-y-1.5 bg-gradient-to-br from-slate-50 to-slate-100 w-full h-full">
                      <div className="w-9 h-9 rounded-full border border-gold/40 bg-white flex items-center justify-center text-gold shadow-xs">
                        <FolderTree className="w-4 h-4 stroke-[1.5]" />
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">No photo</span>
                    </div>
                  )}

                  {/* Uploading Spinner Overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-navy/80 backdrop-blur-xs flex flex-col items-center justify-center text-white text-xs gap-1.5 z-20">
                      <Loader2 className="w-6 h-6 animate-spin text-gold" />
                      <span className="text-[10px] font-semibold tracking-wide">Uploading...</span>
                    </div>
                  )}
                </div>

                {/* Card Title */}
                <div className="text-center space-y-0.5">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-gold block">
                    Card #{cat.display_order}
                  </span>
                  <h3 className="text-xs font-semibold text-slate-900 line-clamp-2 min-h-[32px] flex items-center justify-center">
                    {cat.name}
                  </h3>
                </div>

                {/* Direct 1-Click Upload Action */}
                <div className="space-y-1.5 pt-1">
                  <label className="cursor-pointer w-full py-2 px-2 bg-navy hover:bg-navy-deep text-white text-[11px] font-semibold rounded flex items-center justify-center gap-1.5 transition-colors shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-gold" />
                    <span>{cat.image_url ? "Change Photo" : "Upload Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isUploading}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleDirectUpload(cat.id, file);
                      }}
                    />
                  </label>

                  {cat.image_url && (
                    <button
                      onClick={() => handleRemovePhoto(cat.id)}
                      disabled={isUploading}
                      className="w-full text-center text-[10px] text-red-500 hover:text-red-700 py-0.5 transition-colors"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Edit Modal / Form */}
      {isEditing && editingCategory && (
        <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-lg shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-lg font-serif text-slate-900">
              {editingCategory.id ? "Edit Category Details" : "New Category"}
            </h2>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditingCategory(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveCategory} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={editingCategory.name || ""}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                    setEditingCategory({ ...editingCategory, name, slug });
                  }}
                  required
                  placeholder="e.g. Shirting Fabrics"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={editingCategory.slug || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, slug: e.target.value })
                  }
                  required
                  placeholder="shirting-fabrics"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ""}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, description: e.target.value })
                  }
                  placeholder="A curated collection of shirting cloth..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                />
              </div>

              {/* Cover Image Upload */}
              <div className="sm:col-span-2 space-y-2">
                <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700">
                  Category Cover Image (Cloudinary)
                </label>

                {editingCategory.image_url ? (
                  <div className="relative w-36 h-28 bg-slate-100 rounded border border-slate-200 overflow-hidden group">
                    <Image
                      src={editingCategory.image_url}
                      alt={editingCategory.name || "Category"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label className="cursor-pointer px-2 py-1 bg-white text-slate-800 text-[10px] font-semibold rounded shadow">
                        Change
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleModalImageUpload(e.target.files[0]);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full sm:w-80 h-32 border-2 border-dashed border-slate-300 hover:border-gold rounded cursor-pointer bg-slate-50 transition-colors">
                    {uploadingImage ? (
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Loader2 className="w-4 h-4 animate-spin text-gold" />
                        <span>Uploading to Cloudinary...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-slate-500 text-xs gap-1">
                        <Upload className="w-5 h-5 text-gold" />
                        <span>Click to upload cover image</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleModalImageUpload(e.target.files[0]);
                      }}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-luxury font-medium text-slate-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={editingCategory.display_order || 1}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      display_order: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center gap-6 pt-6">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCategory.is_active ?? true}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, is_active: e.target.checked })
                    }
                    className="w-4 h-4 text-navy rounded border-slate-300"
                  />
                  <span>Active &amp; Published</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCategory.is_nav_item ?? true}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, is_nav_item: e.target.checked })
                    }
                    className="w-4 h-4 text-navy rounded border-slate-300"
                  />
                  <span>Show in Header Navigation</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditingCategory(null);
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
                  <span>Save Category</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 2: CATEGORIES FULL TABLE */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-luxury font-semibold text-slate-700">
            All Configured Store Categories ({categories.length})
          </h3>
        </div>
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs text-slate-600">
          <thead className="bg-slate-50/50 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
            <tr>
              <th className="py-3.5 px-4">Image</th>
              <th className="py-3.5 px-4">Category Name</th>
              <th className="py-3.5 px-4">URL Slug</th>
              <th className="py-3.5 px-4">Order</th>
              <th className="py-3.5 px-4">Header Nav</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4">
                  <div className="relative w-12 h-12 bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center justify-center">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <FolderTree className="w-4 h-4 text-gold/60" />
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 font-medium text-slate-900">{cat.name}</td>
                <td className="py-3 px-4 font-mono text-slate-500">/collections/{cat.slug}</td>
                <td className="py-3 px-4 font-semibold text-slate-700">#{cat.display_order}</td>
                <td className="py-3 px-4">
                  {cat.is_nav_item ? (
                    <span className="text-emerald-700 font-medium">Visible</span>
                  ) : (
                    <span className="text-slate-400">Hidden</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {cat.is_active ? (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-semibold border border-emerald-200">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px]">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right space-x-2">
                  <button
                    onClick={() => {
                      setEditingCategory(cat);
                      setIsEditing(true);
                    }}
                    className="p-1 text-slate-600 hover:text-navy transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
