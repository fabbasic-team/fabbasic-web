import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function EditorialFeature() {
  return (
    <section className="py-20 sm:py-28 bg-beige-subtle/60 border-t border-beige-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Visual Column */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden shadow-xl border border-beige-border bg-white">
              <Image
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80"
                alt="The Art of Fine Fabric - Tailoring Heritage"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
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
