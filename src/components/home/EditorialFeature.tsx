import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Scissors, Sparkles, ShieldCheck } from "lucide-react";

export default function EditorialFeature() {
  return (
    <section className="py-20 sm:py-28 bg-beige-subtle/60 border-t border-beige-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual Column: Atelier & Tailoring Heritage Motif */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden shadow-xl border border-beige-border bg-navy-deep flex flex-col justify-between p-8 sm:p-12 text-ivory">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B99A59_1px,transparent_1px)] [background-size:20px_20px]" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-xs uppercase tracking-luxury text-gold font-mono font-bold">
                  Bespoke Cloth House
                </span>
                <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center text-gold">
                  <Scissors className="w-4 h-4" />
                </div>
              </div>

              <div className="relative z-10 space-y-3 max-w-md">
                <div className="relative w-40 h-11">
                  <Image
                    src="/fab_basic_logo_transparent.png"
                    alt="FAB BASIC"
                    fill
                    className="object-contain object-left brightness-0 invert"
                  />
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif font-light text-ivory leading-snug">
                  Precision in Every Metre. Elegance in Every Thread.
                </h3>
              </div>

              <div className="relative z-10 flex items-center gap-6 pt-4 border-t border-navy-light/60 text-xs text-ivory/60">
                <span>100% Certified Mills</span>
                <span>•</span>
                <span>Pinking Shear Cut</span>
                <span>•</span>
                <span>Heirloom Weaves</span>
              </div>
            </div>
            {/* Elegant accent border offset */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border border-gold/40 -z-10 hidden sm:block" />
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs uppercase tracking-luxury text-gold font-semibold">
              BESPOKE CRAFTSMANSHIP
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-navy font-light leading-tight">
              The Art of Fine Fabric
            </h2>
            <div className="w-12 h-[1px] bg-gold my-4" />
            <p className="text-sm sm:text-base text-charcoal leading-relaxed font-light">
              A bespoke garment is only as exceptional as the cloth from which it is cut. We handpick every bolt for its tactile drape, breathability, and natural longevity.
            </p>
            <p className="text-sm text-charcoal/80 leading-relaxed font-light">
              Whether tailoring a sharp ceremonial two-piece or commissioning everyday executive shirting, our collection bridges European textile precision with Indian sartorial mastery.
            </p>
            <div className="pt-2">
              <Link
                href="/collections"
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-navy hover:bg-navy-deep text-ivory text-xs uppercase tracking-luxury font-semibold transition-colors shadow-md"
              >
                <span>Explore The Mill Archive</span>
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
