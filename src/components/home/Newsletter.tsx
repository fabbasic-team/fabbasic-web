"use client";

import React, { useState } from "react";
import { Check, AlertCircle, Loader2 } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Thank you for subscribing to the FAB BASIC Gazette.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription could not be processed. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-navy-deep text-ivory border-t border-navy-light/40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        <p className="text-xs uppercase tracking-luxury text-gold font-semibold">
          THE FAB BASIC GAZETTE
        </p>

        <h2 className="text-3xl sm:text-4xl font-serif text-ivory font-light tracking-tight">
          A Note from FAB BASIC
        </h2>

        <p className="text-sm sm:text-base text-ivory/70 max-w-lg mx-auto font-light leading-relaxed">
          Be the first to discover new seasonal mill shipments, rare textile releases, and private tailoring invitations.
        </p>

        {/* Subscription Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto pt-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={status === "loading" || status === "success"}
              className="flex-1 px-4 py-3 bg-navy text-ivory placeholder-ivory/40 text-sm border border-navy-light focus:outline-none focus:border-gold transition-colors"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="px-6 py-3 bg-gold hover:bg-gold-hover text-navy text-xs uppercase tracking-luxury font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : status === "success" ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Subscribed</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </div>

          {/* Feedback messages */}
          {status === "success" && (
            <p className="text-xs text-gold flex items-center justify-center gap-1.5 mt-3">
              <Check className="w-3.5 h-3.5" />
              <span>{message}</span>
            </p>
          )}

          {status === "error" && (
            <p className="text-xs text-red-300 flex items-center justify-center gap-1.5 mt-3">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{message}</span>
            </p>
          )}
        </form>

        <p className="text-[11px] text-ivory/40 pt-2">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
