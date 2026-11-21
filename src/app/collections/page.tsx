import Link from "next/link";
import StoreLayout from "@/components/layout/StoreLayout";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductCard from "@/components/product/ProductCard";
import { getStoreSettings, getCategories, getLatestProducts } from "@/lib/data";

export default async function CollectionsIndexPage() {
  const [settings, categories, products] = await Promise.all([
    getStoreSettings(),
    getCategories(),
    getLatestProducts(24),
  ]);

  return (
    <StoreLayout settings={settings} categories={categories}>
      <div className="py-12 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-luxury text-gold font-semibold mb-2">
              FAB BASIC CATALOGUE
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif text-navy font-light tracking-tight">
              All Textile Collections
            </h1>
            <div className="w-12 h-[1px] bg-gold mx-auto my-4" />
            <p className="text-sm sm:text-base text-charcoal font-light leading-relaxed">
              Explore our comprehensive range of shirting fabrics, bespoke suiting, ceremonial cuts, and artisanal Indian textiles.
            </p>
          </div>

          <CategoryGrid categories={categories} />

          {products.length > 0 && (
            <div className="mt-16 pt-16 border-t border-beige-border">
              <h2 className="text-2xl sm:text-3xl font-serif text-navy font-light mb-8">
                Featured Fabric Selections
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </StoreLayout>
  );
}
