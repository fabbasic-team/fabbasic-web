import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";

interface ProductSectionProps {
  products: Product[];
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  viewAllLink?: string;
}

export default function TheLatestEdit({
  products,
  title = "Newly Added Fabric Selections",
  eyebrow = "THE LATEST EDIT",
  subtitle = "Discover the newest additions to our fabric collection.",
  viewAllLink = "/collections",
}: ProductSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 bg-ivory-light border-t border-beige-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <p className="text-[11px] sm:text-xs uppercase tracking-widest text-gold font-semibold mb-2">
              {eyebrow}
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif text-navy font-light tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-charcoal font-light mt-1">
              {subtitle}
            </p>
          </div>

          <Link
            href={viewAllLink}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-luxury text-navy hover:text-gold transition-colors group"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
