"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Loader2,
  Check,
  Scissors,
  Star,
  Sparkles,
  Eye,
  X,
} from "lucide-react";
import { Product, Category, ProductImage } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ]);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "fab-basic/products");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        const newImg = {
          url: data.url,
          image_url: data.url,
          public_id: data.public_id,
          image_public_id: data.public_id,
          alt: editingProduct.title || "Fabric image",
          is_primary: (editingProduct.images || []).length === 0,
        };

        setEditingProduct((prev: any) => ({
          ...prev,
          images: [...(prev.images || []), newImg],
        }));
      } else {
        alert(data.error || "Failed to upload image");
      }
    } catch (err: any) {
      alert(err.message || "Upload error");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    const updated = [...(editingProduct.images || [])];
    updated.splice(index, 1);
    if (updated.length > 0 && !updated.some((i) => i.is_primary)) {
      updated[0].is_primary = true;
    }
    setEditingProduct({ ...editingProduct, images: updated });
  };

  const setPrimaryImage = (index: number) => {
    const updated = (editingProduct.images || []).map((img: any, idx: number) => ({
      ...img,
      is_primary: idx === index,
    }));
    setEditingProduct({ ...editingProduct, images: updated });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.title || !editingProduct.price) {
      alert("Please provide title and price");
      return;
    }

    setSaveStatus("saving");

    try {
      const method = editingProduct.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        setSaveStatus("success");
        setTimeout(() => {
          setSaveStatus(null);
          setIsModalOpen(false);
          setEditingProduct(null);
          fetchData();
        }, 800);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save product");
        setSaveStatus(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to save product");
      setSaveStatus(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fabric product?")) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchData();
      else alert("Failed to delete product");
    } catch {
      alert("Error deleting product");
    }
  };

  const openCreateModal = () => {
    setEditingProduct({
      title: "",
      slug: "",
      category_id: categories[0]?.id || "",
      brand: "FAB BASIC Bespoke",
      sku: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
      price: 1850,
      compare_at_price: null,
      selling_unit: "per_metre",
      min_order_qty: 1.0,
      qty_step: 0.5,
      stock_qty: 50.0,
      fabric_type: "Shirting Cotton",
      fabric_composition: "100% Egyptian Giza Cotton",
      fabric_width: "58 inches / 147 cm",
      fabric_weight: "140 GSM",
      fabric_pattern: "Royal Oxford",
      color_name: "Crisp White",
      color_hex: "#FFFFFF",
      is_in_stock: true,
      is_featured: false,
      is_exclusive: false,
      is_published: true,
      description: "Woven from extra-long staple Egyptian Giza cotton for exceptional lustre and crisp hand-feel.",
      images: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct({
      ...p,
      images: p.images || [],
    });
    setIsModalOpen(true);
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || p.category_id === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif text-slate-900 font-light">
            Fabric Products &amp; Textiles
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage fabric bolts, price per metre, compositions, width, colorways, and Cloudinary photography.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-navy hover:bg-navy-deep text-white text-xs uppercase tracking-luxury font-semibold rounded shadow transition-colors"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>Add New Fabric</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, brand, SKU..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 text-xs rounded focus:outline-none focus:border-gold"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 text-xs rounded focus:outline-none focus:border-gold w-full sm:w-48"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
            {filteredProducts.length} fabrics
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
            <tr>
              <th className="py-3.5 px-4">Fabric</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Price / Unit</th>
              <th className="py-3.5 px-4">Stock</th>
              <th className="py-3.5 px-4">Composition &amp; Width</th>
              <th className="py-3.5 px-4">Tags</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredProducts.map((p) => {
              const primaryImg =
                p.images?.find((i) => i.is_primary)?.image_url ||
                p.images?.[0]?.image_url ||
                "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=400&q=80";

              return (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 bg-slate-100 rounded border border-slate-200 overflow-hidden flex-shrink-0">
                        <Image
                          src={primaryImg}
                          alt={p.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-luxury text-gold font-bold block">
                          {p.brand || "FAB BASIC"}
                        </span>
                        <span className="font-medium text-slate-900 block line-clamp-1">
                          {p.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {p.sku}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {p.category?.name || "Unassigned"}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    ₹{Number(p.price).toLocaleString("en-IN")}{" "}
                    <span className="text-[10px] text-slate-500 font-normal">
                      /{p.selling_unit === "per_metre" ? "m" : "pc"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-semibold ${
                        p.stock_qty > 0 ? "text-slate-800" : "text-amber-600"
                      }`}
                    >
                      {p.stock_qty} {p.selling_unit === "per_metre" ? "metres" : "units"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    <span className="block truncate max-w-[150px]">
                      {p.fabric_composition || "—"}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {p.fabric_width || ""}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {p.is_featured && (
                        <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-bold uppercase rounded border border-amber-200">
                          Signature
                        </span>
                      )}
                      {p.is_exclusive && (
                        <span className="px-1.5 py-0.5 bg-navy text-gold text-[9px] font-bold uppercase rounded">
                          Exclusive
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {p.is_published ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-semibold border border-emerald-200">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px]">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1 text-slate-600 hover:text-navy transition-colors"
                      title="Edit Fabric"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1 text-red-600 hover:text-red-800 transition-colors"
                      title="Delete Fabric"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Comprehensive Product Edit / Create Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-serif text-slate-900">
                {editingProduct.id ? "Edit Fabric Product" : "Add New Fabric Bolt"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-6">
              
              {/* Basic Details */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-luxury text-gold font-bold">
                  1. Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs uppercase tracking-subtle font-medium text-slate-700 mb-1">
                      Fabric Title *
                    </label>
                    <input
                      type="text"
                      value={editingProduct.title || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, title: e.target.value })
                      }
                      required
                      placeholder="e.g. Royal Oxford Egyptian Giza Cotton"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-subtle font-medium text-slate-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={editingProduct.category_id || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, category_id: e.target.value })
                      }
                      required
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-subtle font-medium text-slate-700 mb-1">
                      Brand / Mill
                    </label>
                    <input
                      type="text"
                      value={editingProduct.brand || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, brand: e.target.value })
                      }
                      placeholder="e.g. FAB BASIC Bespoke"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-subtle font-medium text-slate-700 mb-1">
                      SKU / Bolt Ref
                    </label>
                    <input
                      type="text"
                      value={editingProduct.sku || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, sku: e.target.value })
                      }
                      placeholder="FB-1001"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-subtle font-medium text-slate-700 mb-1">
                      Selling Unit
                    </label>
                    <select
                      value={editingProduct.selling_unit || "per_metre"}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, selling_unit: e.target.value })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                    >
                      <option value="per_metre">Sold Per Metre</option>
                      <option value="piece">Sold Per Piece / Cut</option>
                      <option value="set">Sold Per Set</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing & Metre Rules */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-xs uppercase tracking-luxury text-gold font-bold">
                  2. Pricing &amp; Metre Cutting Rules
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-subtle font-medium text-slate-700 mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.price || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      required
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-subtle font-medium text-slate-700 mb-1">
                      Compare Price (₹)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.compare_at_price || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          compare_at_price: e.target.value ? parseFloat(e.target.value) : null,
                        })
                      }
                      placeholder="Original price"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-subtle font-medium text-slate-700 mb-1">
                      Min Cut (Metres/Units)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingProduct.min_order_qty || 1.0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          min_order_qty: parseFloat(e.target.value) || 1.0,
                        })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-subtle font-medium text-slate-700 mb-1">
                      Stock in Stock (Metres/Pcs)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={editingProduct.stock_qty || 0}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          stock_qty: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* Fabric Technical Specifications */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-xs uppercase tracking-luxury text-gold font-bold">
                  3. Fabric Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-subtle font-medium text-slate-700 mb-1">
                      Fabric Type
                    </label>
                    <input
                      type="text"
                      value={editingProduct.fabric_type || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, fabric_type: e.target.value })
                      }
                      placeholder="e.g. Shirting Cotton, Wool Blend"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-subtle font-medium text-slate-700 mb-1">
                      Composition
                    </label>
                    <input
                      type="text"
                      value={editingProduct.fabric_composition || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          fabric_composition: e.target.value,
                        })
                      }
                      placeholder="e.g. 100% Egyptian Giza Cotton"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-subtle font-medium text-slate-700 mb-1">
                      Fabric Width
                    </label>
                    <input
                      type="text"
                      value={editingProduct.fabric_width || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, fabric_width: e.target.value })
                      }
                      placeholder="e.g. 58 inches / 147 cm"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-subtle font-medium text-slate-700 mb-1">
                      Fabric Weight
                    </label>
                    <input
                      type="text"
                      value={editingProduct.fabric_weight || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, fabric_weight: e.target.value })
                      }
                      placeholder="e.g. 140 GSM / 280 GSM"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-subtle font-medium text-slate-700 mb-1">
                      Weave / Pattern
                    </label>
                    <input
                      type="text"
                      value={editingProduct.fabric_pattern || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          fabric_pattern: e.target.value,
                        })
                      }
                      placeholder="e.g. Herringbone, Twill, Oxford"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-subtle font-medium text-slate-700 mb-1">
                      Colour Name
                    </label>
                    <input
                      type="text"
                      value={editingProduct.color_name || ""}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, color_name: e.target.value })
                      }
                      placeholder="e.g. Midnight Navy"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-subtle font-medium text-slate-700 mb-1">
                    Curator&apos;s Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, description: e.target.value })
                    }
                    placeholder="Bespoke textile description..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 text-sm rounded focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {/* Cloudinary Multi-Image Upload */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-xs uppercase tracking-luxury text-gold font-bold">
                  4. Photography (Cloudinary CDN)
                </h3>
                
                <div className="flex flex-wrap gap-4">
                  {(editingProduct.images || []).map((img: any, idx: number) => (
                    <div
                      key={idx}
                      className="relative w-28 h-36 rounded border border-slate-200 overflow-hidden group bg-slate-100"
                    >
                      <Image
                        src={img.image_url || img.url}
                        alt="Product visual"
                        fill
                        className="object-cover"
                      />
                      {img.is_primary && (
                        <span className="absolute top-1 left-1 bg-gold text-navy text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                          Primary
                        </span>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                        {!img.is_primary && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(idx)}
                            className="px-2 py-0.5 bg-white text-navy text-[10px] rounded font-semibold"
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="px-2 py-0.5 bg-red-600 text-white text-[10px] rounded font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}

                  <label className="w-28 h-36 border-2 border-dashed border-slate-300 hover:border-gold rounded flex flex-col items-center justify-center cursor-pointer bg-slate-50 text-slate-500 transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="w-5 h-5 animate-spin text-gold" />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gold mb-1" />
                        <span className="text-[10px] font-medium text-center">
                          Upload Photo
                        </span>
                      </>
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
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_published ?? true}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        is_published: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-navy rounded border-slate-300"
                  />
                  <span>Published on Storefront</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured ?? false}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        is_featured: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-navy rounded border-slate-300"
                  />
                  <span>Featured in Signature Selection (Best Sellers)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_exclusive ?? false}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        is_exclusive: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-navy rounded border-slate-300"
                  />
                  <span>Exclusive Luxury Suiting (Beyond the Ordinary)</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-6 border-t border-slate-200 flex justify-end gap-3 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                      <span>Saving Fabric...</span>
                    </>
                  ) : saveStatus === "success" ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save Fabric Bolt</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
