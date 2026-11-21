import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Scissors } from "lucide-react";
import { StoreSettings } from "@/types";

export default function EditorialFeature({ settings }: { settings?: StoreSettings }) {
  const editorial = settings?.editorial_feature;

  // Visibility toggle controlled by admin
  if (editorial && editorial.is_active === false) {
    return null;
  }

  const heading = editorial?.heading || "The Art of Fine Fabric";
  const eyebrow = editorial?.eyebrow || "BESPOKE CRAFTSMANSHIP";
  const text1 =
    editorial?.text_1 ||
    "A bespoke garment is only as exceptional as the cloth from which it is cut. We handpick every bolt for its tactile drape, breathability, and natural longevity.";
  const text2 =
    editorial?.text_2 ||
    "Whether tailoring a sharp ceremonial two-piece or commissioning everyday executive shirting, our collection bridges European textile precision with Indian sartorial mastery.";
  const ctaText = editorial?.cta_text || "Explore The Mill Archive";
  const ctaLink = editorial?.cta_link || "/collections";
  const cardTag = editorial?.card_tag || "Bespoke Cloth House";
  const cardTitle = editorial?.card_title || "Precision in Every Metre. Elegance in Every Thread.";
  const cardFeatures = editorial?.card_features?.length
    ? editorial.card_features
    : ["100% Certified Mills", "Pinking Shear Cut", "Heirloom Weaves"];
  const imageUrl = editorial?.image_url;

  return (
    <section className="py-20 sm:py-28 bg-beige-subtle/60 border-t border-beige-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual Column: Atelier & Tailoring Heritage Motif */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden shadow-xl border border-beige-border bg-navy-deep flex flex-col justify-between p-8 sm:p-12 text-ivory">
              
              {/* Custom Uploaded Photography OR Luxury Monogram Canvas */}
              {imageUrl ? (
                <>
                  <Image
                    src={imageUrl}
                    alt={cardTitle}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/50 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B99A59_1px,transparent_1px)] [background-size:20px_20px]" />
              )}
              
              {/* Card Top Tag */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs uppercase tracking-luxury text-gold font-mono font-bold">
                  {cardTag}
                </span>
                <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center text-gold bg-navy/40 backdrop-blur-xs">
                  <Scissors className="w-4 h-4" />
                </div>
              </div>

              {/* Card Middle Logo & Title */}
              <div className="relative z-10 space-y-3 max-w-md">
                <div className="relative w-40 h-11">
                  <Image
                    src="/fab_basic_logo_transparent.png"
                    alt="FAB BASIC"
                    fill
                    className="object-contain object-left brightness-0 invert"
                  />
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-light text-ivory leading-snug drop-shadow-sm">
                  {cardTitle}
                </h3>
              </div>

              {/* Card Bottom Features */}
              <div className="relative z-10 flex flex-wrap items-center gap-3 sm:gap-6 pt-4 border-t border-navy-light/60 text-xs text-ivory/70">
                {cardFeatures.map((feat, idx) => (
                  <React.Fragment key={feat}>
                    <span>{feat}</span>
                    {idx < cardFeatures.length - 1 && (
                      <span className="text-gold/60">•</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Elegant accent border offset */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold/40 -z-10 hidden sm:block" />
          </div>

          {/* Editorial Content Column */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs uppercase tracking-luxury text-gold font-semibold">
              {eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-navy font-light leading-tight">
              {heading}
            </h2>
            <div className="w-12 h-[1px] bg-gold my-4" />
            <p className="text-sm sm:text-base text-charcoal leading-relaxed font-light">
              {text1}
            </p>
            {text2 && (
              <p className="text-sm text-charcoal/80 leading-relaxed font-light">
                {text2}
              </p>
            )}
            <div className="pt-2">
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-navy hover:bg-navy-deep text-ivory text-xs uppercase tracking-luxury font-semibold transition-colors shadow-md"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
