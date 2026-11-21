import Link from "next/link";
import Image from "next/image";
import { StoreSettings, Category } from "@/types";

interface FooterProps {
  settings: StoreSettings;
  categories: Category[];
}

export default function Footer({ settings, categories }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerCategories = categories.length > 0 ? categories : [
    { id: "1", name: "Shirting Fabrics", slug: "shirting-fabrics" },
    { id: "2", name: "Suiting Fabrics", slug: "suiting-fabrics" },
    { id: "3", name: "Exclusive Luxury Suiting", slug: "exclusive-luxury-suiting" },
    { id: "4", name: "Readymade", slug: "readymade" },
    { id: "5", name: "Dhoti / Veshti", slug: "dhoti-veshti" },
    { id: "6", name: "Accessories", slug: "accessories" },
  ];

  return (
    <footer className="bg-navy-deep text-ivory/80 pt-16 pb-12 border-t border-navy-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-navy-light/40">
          
          {/* Column 1: Brand & Craftsmanship */}
          <div className="lg:col-span-2 space-y-5">
            <div className="relative w-48 h-14">
              <Image
                src="/fab_basic_logo_transparent.png"
                alt={settings.site_name}
                fill
                className="object-contain object-left brightness-0 invert"
              />
            </div>
            <p className="text-xs tracking-luxury text-gold uppercase font-medium">
              {settings.tagline}
            </p>
            <p className="text-sm text-ivory/70 max-w-sm leading-relaxed">
              Purveyors of finest luxury fabrics, artisanal shirting, bespoke suiting, and heritage Indian weaves. Crafted for master tailoring and uncompromising elegance.
            </p>
            <div className="pt-2 text-xs text-ivory/60 space-y-1">
              <p>{settings.contact_address}</p>
              <p>Direct Inquiries: <span className="text-ivory font-medium">{settings.contact_email}</span></p>
              <p>Tailoring Concierge: <span className="text-ivory font-medium">{settings.contact_phone}</span></p>
            </div>
          </div>

          {/* Column 2: Collections */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-luxury text-gold font-semibold">
              Collections
            </h3>
            <ul className="space-y-2.5 text-sm">
              {footerCategories.map((cat) => (
                <li key={cat.id || cat.slug}>
                  <Link
                    href={`/collections/${cat.slug}`}
                    className="hover:text-gold transition-colors duration-200"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: The House */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-luxury text-gold font-semibold">
              The House
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  Our Heritage
                </Link>
              </li>
              <li>
                <Link href="/bespoke-guide" className="hover:text-gold transition-colors">
                  Fabric &amp; Metre Guide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Bespoke Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Client Services & Policies */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-luxury text-gold font-semibold">
              Client Care
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/policies/shipping" className="hover:text-gold transition-colors">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-gold transition-colors">
                  Returns &amp; Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-gold transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-ivory/50 gap-4">
          <p>© {currentYear} {settings.site_name}. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors uppercase tracking-subtle"
              >
                Instagram
              </a>
            )}
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors uppercase tracking-subtle"
              >
                Facebook
              </a>
            )}
            {settings.whatsapp_number && (
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors uppercase tracking-subtle"
              >
                WhatsApp Concierge
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
