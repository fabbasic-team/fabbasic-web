"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck } from "lucide-react";

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
    <div className="min-h-screen bg-navy-deep flex flex-col justify-center items-center px-4 py-12 text-ivory">
      
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-navy via-navy-deep to-[#050B1A] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8 space-y-3">
          <div className="relative w-48 h-14 mx-auto">
            <Image
              src="/fab-basic-logo.png"
              alt="FAB BASIC"
              fill
              priority
              className="object-contain brightness-0 invert"
            />
          </div>
          <p className="text-xs uppercase tracking-luxury text-gold font-medium">
            ADMINISTRATIVE CONTENT SUITE
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-navy/80 backdrop-blur-md border border-navy-light/60 p-8 rounded-sm shadow-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-serif text-ivory font-light text-center">
              Sign In to Management
            </h1>
            <p className="text-xs text-ivory/60 text-center mt-1">
              Authorized personnel access only
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-luxury text-gold font-medium mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ivory/40 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@fabbasic.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-deep/90 border border-navy-light text-ivory text-sm rounded focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-luxury text-gold font-medium mb-1.5">
                Secure Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-ivory/40 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-deep/90 border border-navy-light text-ivory text-sm rounded focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-gold hover:bg-gold-hover text-navy text-xs uppercase tracking-luxury font-bold transition-all duration-200 rounded flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Enter Admin Suite</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-navy-light/40 pt-4 flex items-center justify-center gap-2 text-[11px] text-ivory/40">
            <ShieldCheck className="w-3.5 h-3.5 text-gold/80" />
            <span>Protected by FAB BASIC Session Security</span>
          </div>
        </div>

      </div>
    </div>
  );
}
