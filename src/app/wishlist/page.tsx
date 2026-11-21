import { Metadata } from "next";
import StoreLayout from "@/components/layout/StoreLayout";
import { getStoreSettings, getCategories } from "@/lib/data";
import WishlistClient from "./WishlistClient";

export const metadata: Metadata = {
  title: "Bespoke Wishlist | FAB BASIC — STITCH • STYLE • ELEGANCE",
  description:
    "Review your saved shirting fabrics, suiting cloths, and bespoke cuts.",
};

export default async function WishlistPage() {
  const [settings, categories] = await Promise.all([
    getStoreSettings(),
    getCategories(),
  ]);

  return (
    <StoreLayout settings={settings} categories={categories}>
      <WishlistClient />
    </StoreLayout>
  );
}
