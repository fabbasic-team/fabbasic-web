import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import StoreLayout from "@/components/layout/StoreLayout";
import { getStoreSettings, getCategories } from "@/lib/data";

export default async function ContactPage() {
  const [settings, categories] = await Promise.all([
    getStoreSettings(),
    getCategories(),
  ]);

  return (
    <StoreLayout settings={settings} categories={categories}>
      <div className="py-16 sm:py-24 bg-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <p className="text-xs uppercase tracking-luxury text-gold font-semibold">
              FAB BASIC CONCIERGE
            </p>
            <h1 className="text-3xl sm:text-5xl font-serif text-navy font-light">
              Client Care &amp; Tailoring Inquiries
            </h1>
            <div className="w-12 h-[1px] bg-gold mx-auto my-4" />
            <p className="text-sm sm:text-base text-charcoal font-light max-w-md mx-auto">
              Our clothiers are available to answer queries regarding fabric drape, meterage requirements, and mill origins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Contact Details Card */}
            <div className="p-8 bg-white border border-beige-border rounded-sm shadow-sm space-y-6">
              <h2 className="text-xl font-serif text-navy">Direct Contact</h2>

              <div className="space-y-4 text-xs text-charcoal">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-navy block text-sm">Email Inquiries</span>
                    <a href={`mailto:${settings.contact_email}`} className="text-gold hover:underline">
                      {settings.contact_email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-navy block text-sm">Telephone Concierge</span>
                    <span>{settings.contact_phone}</span>
                    <p className="text-[11px] text-charcoal/60 mt-0.5">Mon – Sat, 10:00 AM – 7:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-navy block text-sm">Atelier &amp; Distribution</span>
                    <span>{settings.contact_address}</span>
                  </div>
                </div>
              </div>

              {settings.whatsapp_number && (
                <div className="pt-4 border-t border-beige-border">
                  <a
                    href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-luxury font-bold rounded flex items-center justify-center gap-2 transition-colors shadow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              )}
            </div>

            {/* Quick Inquiry Form */}
            <div className="p-8 bg-white border border-beige-border rounded-sm shadow-sm space-y-4">
              <h2 className="text-xl font-serif text-navy">Send an Inquiry</h2>

              <form className="space-y-4 text-xs">
                <div>
                  <label className="block uppercase tracking-subtle font-medium text-charcoal mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="w-full px-3.5 py-2.5 bg-ivory border border-beige-border rounded focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-subtle font-medium text-charcoal mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 bg-ivory border border-beige-border rounded focus:outline-none focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-subtle font-medium text-charcoal mb-1">
                    Message / Tailoring Query
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the garment you are planning to tailor..."
                    className="w-full px-3.5 py-2.5 bg-ivory border border-beige-border rounded focus:outline-none focus:border-gold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-navy hover:bg-navy-deep text-ivory uppercase tracking-luxury font-semibold rounded shadow transition-colors"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    </StoreLayout>
  );
}
