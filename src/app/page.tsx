import StoreLayout from "@/components/layout/StoreLayout";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryGrid from "@/components/home/CategoryGrid";
import TheLatestEdit from "@/components/home/TheLatestEdit";
import EditorialFeature from "@/components/home/EditorialFeature";
import TheSignatureSelection from "@/components/home/TheSignatureSelection";
import BeyondTheOrdinary from "@/components/home/BeyondTheOrdinary";
import BrandStory from "@/components/home/BrandStory";
import Newsletter from "@/components/home/Newsletter";

import {
  getStoreSettings,
  getHomepageBanners,
  getCategories,
  getLatestProducts,
  getFeaturedProducts,
  getExclusiveProducts,
} from "@/lib/data";

export const revalidate = 60; // Cache for 60 seconds on Vercel to save compute & Supabase API quotas

export default async function HomePage() {
  // Fetch real data in parallel
  const [
    settings,
    banners,
    categories,
    latestProducts,
    featuredProducts,
    exclusiveProducts,
  ] = await Promise.all([
    getStoreSettings(),
    getHomepageBanners(),
    getCategories(),
    getLatestProducts(8),
    getFeaturedProducts(8),
    getExclusiveProducts(4),
  ]);

  return (
    <StoreLayout settings={settings} categories={categories}>
      {/* Editorial Hero Banners (Up to 3, separate desktop & mobile images) */}
      <HeroCarousel banners={banners} />

      {/* Explore Our Collections: 6 Primary Category Showcase */}
      <CategoryGrid categories={categories} />

      {/* The Latest Edit: Recently Added Fabric Selections */}
      <TheLatestEdit products={latestProducts} />

      {/* Editorial Feature: The Art of Fine Fabric */}
      <EditorialFeature settings={settings} />

      {/* The Signature Selection: Best Sellers */}
      <TheSignatureSelection products={featuredProducts} />

      {/* Beyond the Ordinary: Exclusive Luxury Suiting */}
      <BeyondTheOrdinary products={exclusiveProducts} />

      {/* Brand Heritage Story: A Tradition of Style. A Standard of Quality. */}
      <BrandStory settings={settings} />

      {/* Brevo Newsletter Integration */}
      <Newsletter />
    </StoreLayout>
  );
}
