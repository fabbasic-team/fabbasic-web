"use client";

import React, { useState, useEffect } from "react";
import { Save, Check, Loader2, Globe, Shield, CreditCard, Mail } from "lucide-react";
import { StoreSettings } from "@/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Partial<StoreSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
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
          Manage announcements, brand story, client concierge contacts, and payment integrations.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Announcement Bar */}
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

        {/* Section 2: Brand Heritage Story */}
        <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Shield className="w-5 h-5 text-gold" />
            <h2 className="text-base font-semibold text-slate-900">
              Brand Story Section
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

        {/* Section 3: Contact & Concierge Information */}
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

        {/* Section 4: Shipping Thresholds */}
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
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saveStatus === "saving"}
            className="px-8 py-3 bg-navy hover:bg-navy-deep text-white text-xs uppercase tracking-luxury font-bold rounded shadow-lg flex items-center gap-2"
          >
            {saveStatus === "saving" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-gold" />
                <span>Saving Settings...</span>
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
