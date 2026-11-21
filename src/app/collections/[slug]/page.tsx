import { notFound } from "next/navigation";
import Link from "next/link";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductCard from "@/components/product/ProductCard";
import { getStoreSettings, getCategories, getCategoryBySlug } from "@/lib/data";
import { createAdminClient } from "@/utils/supabase/admin";
import { Product } from "@/types";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { slug } = await params;
  const { sort } = await searchParams;

  const [settings, categories, category] = await Promise.all([
    getStoreSettings(),
    getCategories(),
    getCategoryBySlug(slug),
  ]);

  // Fetch products in this category
  const supabase = createAdminClient();
  let query = supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*)")
    .eq("is_published", true);

  if (category?.id) {
    query = query.eq("category_id", category.id);
  }

  // Handle sorting
  if (sort === "price-low") {
    query = query.order("price", { ascending: true });
  } else if (sort === "price-high") {
    query = query.order("price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data: productsData } = await query;
  const products = (productsData || []) as Product[];

  const categoryName = category?.name || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <StoreLayout settings={settings} categories={categories}>
      <div className="py-8 sm:py-12 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="text-xs uppercase tracking-subtle text-charcoal/70 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-gold transition-colors">Collections</Link>
            <span>/</span>
            <span className="text-navy font-semibold">{categoryName}</span>
          </nav>

          {/* Collection Header */}
          <div className="border-b border-beige-border pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-luxury text-gold font-semibold mb-2">
                FAB BASIC ARCHIVE
              </p>
              <h1 className="text-3xl sm:text-5xl font-serif text-navy font-light tracking-tight">
                {categoryName}
              </h1>
              {category?.description && (
                <p className="text-sm sm:text-base text-charcoal font-light max-w-xl mt-2 leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>

            {/* Product Count & Sort */}
            <div className="flex items-center gap-4 text-xs">
              <span className="text-charcoal font-medium">
                {products.length} {products.length === 1 ? "fabric" : "fabrics"} available
              </span>

              <div className="flex items-center gap-2">
                <span className="text-charcoal/60 uppercase tracking-subtle">Sort:</span>
                <div className="flex gap-1 border border-beige-border bg-white rounded p-0.5">
                  <Link
                    href={`/collections/${slug}`}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      !sort ? "bg-navy text-ivory font-medium" : "text-charcoal hover:text-navy"
                    }`}
                  >
                    Latest
                  </Link>
                  <Link
                    href={`/collections/${slug}?sort=price-low`}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      sort === "price-low" ? "bg-navy text-ivory font-medium" : "text-charcoal hover:text-navy"
                    }`}
                  >
                    Price: Low
                  </Link>
                  <Link
                    href={`/collections/${slug}?sort=price-high`}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      sort === "price-high" ? "bg-navy text-ivory font-medium" : "text-charcoal hover:text-navy"
                    }`}
                  >
                    Price: High
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-20 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-beige-subtle mx-auto flex items-center justify-center">
                <span className="text-gold text-2xl font-serif">✦</span>
              </div>
              <h2 className="text-2xl font-serif text-navy">Collection Curating</h2>
              <p className="text-sm text-charcoal leading-relaxed font-light">
                Our mill shipments for {categoryName} are currently being catalogued. Please check back shortly or explore our other collections.
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-block px-6 py-2.5 bg-navy text-ivory text-xs uppercase tracking-luxury font-semibold hover:bg-gold hover:text-navy transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </StoreLayout>
  );
}
