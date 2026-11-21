import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Scissors } from "lucide-react";
import { Product, StoreSettings } from "@/types";
import ProductCard from "@/components/product/ProductCard";

interface ExclusiveCollectionProps {
  products: Product[];
  settings?: StoreSettings;
  title?: string;
  subtitle?: string;
}

export default function BeyondTheOrdinary({
  products,
  settings,
  title,
  subtitle,
}: ExclusiveCollectionProps) {
  const exclusive = settings?.exclusive_feature;

  // Visibility toggle controlled from Admin CMS
  if (exclusive && exclusive.is_active === false) {
    return null;
  }

  const sectionEyebrow = exclusive?.section_eyebrow || "EXCLUSIVE LUXURY SUITING";
  const sectionTitle = exclusive?.section_heading || title || "Beyond the Ordinary";
  const sectionSubtitle =
    exclusive?.section_subheading ||
    subtitle ||
    "Discover exceptional fabrics selected for discerning tastes.";

  const cardEyebrow = exclusive?.card_eyebrow || "Haute Tailoring Textiles";
  const cardTitle =
    exclusive?.card_title || "Super 150s Worsted Wools, Cashmere Blends & Noble Silks";
  const cardDescription =
    exclusive?.card_description ||
    "Each cut in our exclusive collection is sourced directly from prestigious European and master Indian mills. Reserved for the pinnacle of bespoke suiting, ceremonial tuxedos, and tailored eveningwear.";
  const ctaText = exclusive?.cta_text || "Request Bespoke Fabric Swatches";
  const ctaLink = exclusive?.cta_link || "/collections/exclusive-luxury-suiting";
  const badgeTitle = exclusive?.badge_title || "Atelier Suiting Cuts";
  const badgeSubtitle = exclusive?.badge_subtitle || "STITCH • STYLE • ELEGANCE";
  const imageUrl = exclusive?.image_url;

  return (
    <section className="py-20 sm:py-28 bg-navy-deep text-ivory relative overflow-hidden border-t border-navy-light/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="text-[11px] sm:text-xs uppercase tracking-widest text-gold font-semibold mb-2">
            {sectionEyebrow}
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif text-ivory font-light tracking-tight">
            {sectionTitle}
          </h2>
          <div className="w-12 h-[1px] bg-gold my-4" />
          <p className="text-sm sm:text-base text-ivory/70 font-light leading-relaxed">
            {sectionSubtitle}
          </p>
        </div>

        {/* Content */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Editorial Atmosphere Showcase */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-navy/60 p-8 sm:p-12 border border-navy-light/40 rounded-sm">
            <div className="lg:col-span-8 space-y-6">
              <span className="text-xs uppercase tracking-luxury text-gold font-semibold">
                {cardEyebrow}
              </span>
              <h3 className="text-2xl sm:text-4xl font-serif text-ivory font-light leading-tight">
                {cardTitle}
              </h3>
              <p className="text-sm text-ivory/70 leading-relaxed max-w-xl font-light">
                {cardDescription}
              </p>
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gold hover:bg-gold-hover text-navy text-xs font-semibold uppercase tracking-luxury transition-colors shadow-md"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Visual Card on the right */}
            <div className="lg:col-span-4 aspect-[4/3] rounded bg-navy-surface border border-navy-light relative overflow-hidden flex flex-col items-center justify-center p-6 text-center space-y-3 shadow-md group">
              {imageUrl ? (
                <>
                  <Image
                    src={imageUrl}
                    alt={badgeTitle}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/50 to-transparent" />
                  <div className="relative z-10 space-y-2">
                    <div className="w-10 h-10 rounded-full border border-gold/40 bg-navy/50 backdrop-blur-xs flex items-center justify-center text-gold mx-auto">
                      <Scissors className="w-4 h-4" />
                    </div>
                    <span className="font-serif text-lg text-ivory block font-light">{badgeTitle}</span>
                    <span className="text-[10px] text-gold uppercase tracking-luxury block">{badgeSubtitle}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <span className="font-serif text-lg text-ivory font-light">{badgeTitle}</span>
                  <span className="text-[11px] text-gold uppercase tracking-luxury">{badgeSubtitle}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
