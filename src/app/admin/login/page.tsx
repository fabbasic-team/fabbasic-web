"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid administrative credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1124] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      
      {/* Background Subtle Luxury Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(185,154,89,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#FAF9F6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-2xl border border-gold/30 p-8 sm:p-10 space-y-7 relative">
          
          {/* Top Gold Accent Bar */}
          <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-gold/40 via-gold to-gold/40 rounded-b" />

          {/* Brand Header */}
          <div className="text-center space-y-3 pt-2">
            <div className="relative w-48 h-14 mx-auto flex items-center justify-center">
              <Image
                src="/fab_basic_logo_transparent.png"
                alt="FAB BASIC"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
              <p className="text-[11px] uppercase tracking-widest text-slate-500 font-bold">
                Administrative Management Suite
              </p>
              <span className="w-1.5 h-1.5 rounded-full bg-gold inline-block" />
            </div>
          </div>

          {/* Form Header */}
          <div className="border-t border-slate-100 pt-5 text-center">
            <h1 className="text-xl sm:text-2xl font-serif text-slate-900 font-medium">
              Sign In to Management
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-light">
              Enter your authorized executive credentials to access catalog and order controls.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md font-medium flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-luxury text-slate-700 font-semibold mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@fabbasic.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-gold focus:ring-2 focus:ring-gold/20 text-slate-900 placeholder:text-slate-400 text-sm rounded-md transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury text-slate-700 font-semibold mb-1.5">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-gold focus:ring-2 focus:ring-gold/20 text-slate-900 placeholder:text-slate-400 text-sm rounded-md transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-navy hover:bg-navy-deep text-gold hover:text-white text-xs uppercase tracking-luxury font-bold transition-all duration-200 rounded-md flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gold" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-gold" />
                  <span>Enter Admin Suite</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Security Assurance */}
          <div className="border-t border-slate-100 pt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0" />
            <span>Protected by FAB BASIC Session Security • 256-Bit TLS</span>
          </div>
        </div>

        {/* Back to Storefront Link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-xs text-slate-400 hover:text-gold transition-colors inline-flex items-center gap-1.5"
          >
            <span>← Return to Public Storefront</span>
          </a>
        </div>

      </div>
    </div>
  );
}
