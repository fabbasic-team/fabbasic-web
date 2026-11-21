import { createAdminClient } from "@/utils/supabase/admin";
import {
  StoreSettings,
  HomepageBanner,
  Category,
  Product,
  EditorialFeatureSettings,
  ExclusiveFeatureSettings,
} from "@/types";

export const DEFAULT_EDITORIAL_FEATURE: EditorialFeatureSettings = {
  is_active: true,
  image_url: null,
  image_public_id: null,
  card_tag: "Bespoke Cloth House",
  card_title: "Precision in Every Metre. Elegance in Every Thread.",
  card_features: ["100% Certified Mills", "Pinking Shear Cut", "Heirloom Weaves"],
  eyebrow: "BESPOKE CRAFTSMANSHIP",
  heading: "The Art of Fine Fabric",
  text_1:
    "A bespoke garment is only as exceptional as the cloth from which it is cut. We handpick every bolt for its tactile drape, breathability, and natural longevity.",
  text_2:
    "Whether tailoring a sharp ceremonial two-piece or commissioning everyday executive shirting, our collection bridges European textile precision with Indian sartorial mastery.",
  cta_text: "Explore The Mill Archive",
  cta_link: "/collections",
};

export const DEFAULT_EXCLUSIVE_FEATURE: ExclusiveFeatureSettings = {
  is_active: true,
  image_url: null,
  image_public_id: null,
  section_eyebrow: "EXCLUSIVE LUXURY SUITING",
  section_heading: "Beyond the Ordinary",
  section_subheading: "Discover exceptional fabrics selected for discerning tastes.",
  card_eyebrow: "Haute Tailoring Textiles",
  card_title: "Super 150s Worsted Wools, Cashmere Blends & Noble Silks",
  card_description:
    "Each cut in our exclusive collection is sourced directly from prestigious European and master Indian mills. Reserved for the pinnacle of bespoke suiting, ceremonial tuxedos, and tailored eveningwear.",
  cta_text: "Request Bespoke Fabric Swatches",
  cta_link: "/collections/exclusive-luxury-suiting",
  badge_title: "Atelier Suiting Cuts",
  badge_subtitle: "STITCH • STYLE • ELEGANCE",
};

// Default settings if database row is not yet initialized
export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  id: "default",
  site_name: "FAB BASIC",
  tagline: "STITCH • STYLE • ELEGANCE",
  announcement_active: true,
  announcement_text: "New Season Fabrics | Discover our latest collection",
  announcement_link: "/collections",
  contact_email: "care@fabbasic.com",
  contact_phone: "+91 98765 43210",
  contact_address: "Heritage Textile House, Mumbai, India",
  whatsapp_number: "+919876543210",
  instagram_url: "https://instagram.com/fabbasic",
  facebook_url: "https://facebook.com/fabbasic",
  brand_story_heading: "A Tradition of Style. A Standard of Quality.",
  brand_story_subheading: "Curated by Master Clothiers",
  brand_story_text:
    "At FAB BASIC, we believe tailoring begins with extraordinary cloth. From prestigious European mills to artisanal Indian handloom masters, our textiles are chosen for exceptional drape, durability, and hand-feel.",
  brand_story_image: null,
  editorial_feature: DEFAULT_EDITORIAL_FEATURE,
  exclusive_feature: DEFAULT_EXCLUSIVE_FEATURE,
  signature_selection_heading: "The Signature Selection",
  signature_selection_subheading: "A collection of customer favourites and enduring classics.",
  exclusive_collection_heading: "Beyond the Ordinary",
  exclusive_collection_subheading: "Discover exceptional fabrics selected for discerning tastes.",
  free_shipping_threshold: 2999,
  standard_shipping_fee: 199,
  currency: "INR",
  currency_symbol: "₹",
  updated_at: new Date().toISOString(),
};

/**
 * Fetch store settings
 */
export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_STORE_SETTINGS;
    }

    let editorialFeature = DEFAULT_EDITORIAL_FEATURE;
    let exclusiveFeature = DEFAULT_EXCLUSIVE_FEATURE;

    if (
      data.brand_story_image &&
      typeof data.brand_story_image === "string" &&
      data.brand_story_image.startsWith("{")
    ) {
      try {
        const parsed = JSON.parse(data.brand_story_image);
        if (parsed.editorial_feature) {
          editorialFeature = { ...DEFAULT_EDITORIAL_FEATURE, ...parsed.editorial_feature };
        } else if (parsed.heading) {
          editorialFeature = { ...DEFAULT_EDITORIAL_FEATURE, ...parsed };
        }
        if (parsed.exclusive_feature) {
          exclusiveFeature = { ...DEFAULT_EXCLUSIVE_FEATURE, ...parsed.exclusive_feature };
        }
      } catch (err) {
        console.error("Error parsing feature settings JSON:", err);
      }
    }

    return {
      ...data,
      editorial_feature: editorialFeature,
      exclusive_feature: exclusiveFeature,
    } as StoreSettings;
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
}

/**
 * Fetch active homepage banners (up to 3)
 */
export async function getHomepageBanners(): Promise<HomepageBanner[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("homepage_banners")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true })
      .limit(3);

    if (error || !data) {
      return [];
    }
    return data as HomepageBanner[];
  } catch {
    return [];
  }
}

/**
 * Fetch categories
 */
export async function getCategories(options?: { navOnly?: boolean }): Promise<Category[]> {
  try {
    const supabase = createAdminClient();
    let query = supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (options?.navOnly) {
      query = query.eq("is_nav_item", true);
    }

    const { data, error } = await query;
    if (error || !data) {
      return [];
    }
    return data as Category[];
  } catch {
    return [];
  }
}

/**
 * Fetch category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) return null;
    return data as Category;
  } catch {
    return null;
  }
}

/**
 * Fetch latest published products (The Latest Edit)
 */
export async function getLatestProducts(limit: number = 8): Promise<Product[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(*)")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data as Product[];
  } catch {
    return [];
  }
}

/**
 * Fetch featured products (The Signature Selection)
 */
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(*)")
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data as Product[];
  } catch {
    return [];
  }
}

/**
 * Fetch exclusive luxury suiting products (Beyond the Ordinary)
 */
export async function getExclusiveProducts(limit: number = 6): Promise<Product[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(*)")
      .eq("is_published", true)
      .eq("is_exclusive", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data as Product[];
  } catch {
    return [];
  }
}

/**
 * Fetch single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(*)")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error || !data) return null;
    return data as Product;
  } catch {
    return null;
  }
}

/**
 * Search products
 */
export async function searchProducts(searchTerm: string, limit: number = 12): Promise<Product[]> {
  if (!searchTerm || !searchTerm.trim()) return [];
  try {
    const supabase = createAdminClient();
    const term = `%${searchTerm.trim()}%`;
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*), images:product_images(*)")
      .eq("is_published", true)
      .or(`title.ilike.${term},brand.ilike.${term},fabric_type.ilike.${term},fabric_composition.ilike.${term},description.ilike.${term}`)
      .limit(limit);

    if (error || !data) return [];
    return data as Product[];
  } catch {
    return [];
  }
}
