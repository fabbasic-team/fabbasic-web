import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";

interface ExclusiveCollectionProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function BeyondTheOrdinary({
  products,
  title = "Beyond the Ordinary",
  subtitle = "Discover exceptional fabrics selected for discerning tastes.",
}: ExclusiveCollectionProps) {
  return (
    <section className="py-20 sm:py-28 bg-navy-deep text-ivory relative overflow-hidden border-t border-navy-light/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="text-[11px] sm:text-xs uppercase tracking-widest text-gold font-semibold mb-2">
            EXCLUSIVE LUXURY SUITING
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif text-ivory font-light tracking-tight">
            {title}
          </h2>
          <div className="w-12 h-[1px] bg-gold my-4" />
          <p className="text-sm sm:text-base text-ivory/70 font-light leading-relaxed">
            {subtitle}
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
          /* Editorial Atmosphere Showcase when no products are tagged exclusive yet */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-navy/60 p-8 sm:p-12 border border-navy-light/40 rounded-sm">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-luxury text-gold font-semibold">
                Haute Tailoring Textiles
              </span>
              <h3 className="text-2xl sm:text-4xl font-serif text-ivory font-light leading-tight">
                Super 150s Worsted Wools, Cashmere Blends &amp; Noble Silks
              </h3>
              <p className="text-sm text-ivory/70 leading-relaxed max-w-xl font-light">
                Each cut in our exclusive collection is sourced directly from prestigious European and master Indian mills. Reserved for the pinnacle of bespoke suiting, ceremonial tuxedos, and tailored eveningwear.
              </p>
              <Link
                href="/collections/exclusive-luxury-suiting"
                className="inline-flex items-center gap-3 px-6 py-3 bg-gold hover:bg-gold-hover text-navy text-xs font-semibold uppercase tracking-luxury transition-colors"
              >
                <span>Request Bespoke Fabric Swatches</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="lg:col-span-5 relative aspect-[4/3] rounded overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80"
                alt="Luxury suiting fabric"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
