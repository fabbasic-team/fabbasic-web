import { notFound } from "next/navigation";
import Link from "next/link";
import StoreLayout from "@/components/layout/StoreLayout";
import ProductDetailView from "@/components/product/ProductDetailView";
import ProductCard from "@/components/product/ProductCard";
import { getStoreSettings, getCategories, getProductBySlug } from "@/lib/data";
import { createAdminClient } from "@/utils/supabase/admin";
import { Product } from "@/types";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const [settings, categories, product] = await Promise.all([
    getStoreSettings(),
    getCategories(),
    getProductBySlug(slug),
  ]);

  if (!product) {
    notFound();
  }

  // Fetch related products in the same category
  const supabase = createAdminClient();
  const { data: relatedData } = await supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*)")
    .eq("is_published", true)
    .neq("id", product.id)
    .eq("category_id", product.category_id || "")
    .limit(4);

  const relatedProducts = (relatedData || []) as Product[];

  return (
    <StoreLayout settings={settings} categories={categories}>
      <div className="py-8 sm:py-12 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="text-xs uppercase tracking-subtle text-charcoal/70 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-gold transition-colors">Collections</Link>
            {product.category && (
              <>
                <span>/</span>
                <Link
                  href={`/collections/${product.category.slug}`}
                  className="hover:text-gold transition-colors"
                >
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-navy font-semibold truncate max-w-[200px]">
              {product.title}
            </span>
          </nav>

          {/* Interactive Fabric Showcase View */}
          <ProductDetailView product={product} />

          {/* Related Fabrics */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 sm:mt-28 pt-16 border-t border-beige-border">
              <div className="text-center max-w-xl mx-auto mb-12">
                <p className="text-xs uppercase tracking-luxury text-gold font-semibold mb-2">
                  COMPLEMENTARY WEAVES
                </p>
                <h2 className="text-2xl sm:text-3xl font-serif text-navy font-light">
                  Related Fabric Selections
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((p) => (
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
