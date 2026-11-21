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

          {/* Hero Visual */}
          <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden shadow-xl border border-beige-border">
            <Image
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1600&q=85"
              alt="Bespoke tailoring textiles"
              fill
              className="object-cover"
            />
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
