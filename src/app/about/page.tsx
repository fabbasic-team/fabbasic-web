import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Scissors, Sparkles, ShieldCheck } from "lucide-react";
import StoreLayout from "@/components/layout/StoreLayout";
import { getStoreSettings, getCategories } from "@/lib/data";

export default async function AboutPage() {
  const [settings, categories] = await Promise.all([
    getStoreSettings(),
    getCategories(),
  ]);

  return (
    <StoreLayout settings={settings} categories={categories}>
      <div className="py-16 sm:py-24 bg-ivory">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <p className="text-xs uppercase tracking-luxury text-gold font-semibold">
              THE HOUSE OF FAB BASIC
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-navy font-light leading-tight">
              A Tradition of Style. A Standard of Quality.
            </h1>
            <div className="w-16 h-[1.5px] bg-gold mx-auto my-6" />
            <p className="text-base sm:text-lg text-charcoal font-light max-w-2xl mx-auto leading-relaxed">
              Curated textiles for master tailoring, bespoke shirting, and heirloom traditional Indian weaves.
            </p>
          </div>

          {/* Hero Visual Card */}
          <div className="aspect-[16/9] w-full rounded-sm overflow-hidden shadow-xl border border-beige-border bg-navy-deep p-8 sm:p-12 flex flex-col justify-between text-ivory relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B99A59_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs uppercase tracking-luxury text-gold font-mono font-bold">
                ESTABLISHED TEXTILE HOUSE
              </span>
              <span className="text-xs text-ivory/60">STITCH • STYLE • ELEGANCE</span>
            </div>

            <div className="relative z-10 text-center space-y-4 max-w-lg mx-auto my-auto">
              <div className="relative w-48 h-14 mx-auto">
                <Image
                  src="/fab_basic_logo_transparent.png"
                  alt="FAB BASIC"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <p className="text-sm text-ivory/80 font-light leading-relaxed">
                Purveyors of finest luxury shirting fabrics, worsted wool suiting cloth, and heritage traditional dhotis and veshtis.
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] text-ivory/40 pt-4 border-t border-navy-light/40">
              <span>Direct Mill Partnerships</span>
              <span>Precision Cloth Metering</span>
              <span>Worldwide Bespoke Delivery</span>
            </div>
          </div>

          {/* Philosophy Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-beige-border text-center sm:text-left">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto sm:mx-0">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-navy">The Tailor&apos;s Cut</h3>
              <p className="text-xs text-charcoal leading-relaxed font-light">
                Every bolt in our collection is curated with the bespoke craftsman in mind. Perfect drape, natural resilience, and ease of stitching.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto sm:mx-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-navy">Mill Provenance</h3>
              <p className="text-xs text-charcoal leading-relaxed font-light">
                Direct partnerships with extra-long staple Egyptian Giza cotton cultivators, Italian worsted wool weavers, and Varanasi silk masters.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto sm:mx-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif text-navy">Heirloom Quality</h3>
              <p className="text-xs text-charcoal leading-relaxed font-light">
                Fabrics designed to mature gracefully over years of wear, developing character and softness with every bespoke wear.
              </p>
            </div>
          </div>

          {/* Editorial Closing */}
          <div className="p-8 sm:p-12 bg-navy-deep text-ivory text-center rounded-sm space-y-6">
            <h2 className="text-2xl sm:text-3xl font-serif font-light text-ivory">
              Commission Your Cloth
            </h2>
            <p className="text-sm text-ivory/70 max-w-xl mx-auto font-light leading-relaxed">
              Explore our current shipments or get in touch with our client concierge for specialized bespoke requirements.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold hover:bg-gold-hover text-navy text-xs uppercase tracking-luxury font-bold rounded shadow transition-colors"
            >
              <span>Explore Textile Archive</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </StoreLayout>
  );
}
