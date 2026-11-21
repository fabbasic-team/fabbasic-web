"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Upload, Loader2, Check, FolderTree } from "lucide-react";
import { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

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

  const handleImageUpload = async (file: File) => {
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
      if (res.ok) fetchCategories();
      else {
        const data = await res.json();
        alert(data.error || "Failed to delete");
      }
    } catch (err: any) {
      alert(err.message || "Error deleting category");
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-slate-900 font-light">
            Collections &amp; Categories
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage storefront categories, navigation menus, and collection cover photography.
          </p>
        </div>

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
            <span>Add Category</span>
          </button>
        )}
      </div>

      {/* Category Edit Form */}
      {isEditing && editingCategory && (
        <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-lg shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-lg font-serif text-slate-900">
              {editingCategory.id ? "Edit Category" : "New Category"}
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
                            if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
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
                        <span>Uploading...</span>
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
                        if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
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

      {/* Categories List */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
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
                  <div className="relative w-12 h-12 bg-slate-100 rounded border border-slate-200 overflow-hidden">
                    {cat.image_url ? (
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <FolderTree className="w-5 h-5 text-gold/60" />
                      </div>
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
