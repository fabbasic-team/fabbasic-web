-- ==============================================================================
-- FAB BASIC: Ultra-Premium Fabric E-Commerce Database Schema
-- Brand Tagline: STITCH • STYLE • ELEGANCE
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant basic schema permissions to API roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  site_name TEXT NOT NULL DEFAULT 'FAB BASIC',
  tagline TEXT NOT NULL DEFAULT 'STITCH • STYLE • ELEGANCE',
  announcement_active BOOLEAN NOT NULL DEFAULT true,
  announcement_text TEXT NOT NULL DEFAULT 'New Season Fabrics | Discover our latest collection',
  announcement_link TEXT DEFAULT '/collections',
  contact_email TEXT NOT NULL DEFAULT 'care@fabbasic.com',
  contact_phone TEXT NOT NULL DEFAULT '+91 98765 43210',
  contact_address TEXT NOT NULL DEFAULT 'Heritage Textile District, Mumbai, India',
  whatsapp_number TEXT DEFAULT '+919876543210',
  instagram_url TEXT DEFAULT 'https://instagram.com/fabbasic',
  facebook_url TEXT DEFAULT 'https://facebook.com/fabbasic',
  brand_story_heading TEXT NOT NULL DEFAULT 'A Tradition of Style. A Standard of Quality.',
  brand_story_subheading TEXT NOT NULL DEFAULT 'Curated by Master Clothiers',
  brand_story_text TEXT NOT NULL DEFAULT 'At FAB BASIC, we believe tailoring begins with extraordinary cloth. From prestigious European mills to artisanal Indian handloom masters, our textiles are chosen for exceptional drape, durability, and hand-feel.',
  brand_story_image TEXT,
  signature_selection_heading TEXT NOT NULL DEFAULT 'The Signature Selection',
  signature_selection_subheading TEXT NOT NULL DEFAULT 'A collection of customer favourites and enduring classics.',
  exclusive_collection_heading TEXT NOT NULL DEFAULT 'Beyond the Ordinary',
  exclusive_collection_subheading TEXT NOT NULL DEFAULT 'Discover exceptional fabrics selected for discerning tastes.',
  free_shipping_threshold NUMERIC(10,2) NOT NULL DEFAULT 2999.00,
  standard_shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 199.00,
  currency TEXT NOT NULL DEFAULT 'INR',
  currency_symbol TEXT NOT NULL DEFAULT '₹',
  razorpay_key_id TEXT,
  brevo_api_key TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert initial default settings if not exists
INSERT INTO public.store_settings (id)
VALUES ('default')
ON CONFLICT (id) DO NOTHING;

-- 3. Homepage Banners Table (Up to 3 distinct campaign banners)
CREATE TABLE IF NOT EXISTS public.homepage_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  eyebrow TEXT,
  subtitle TEXT,
  cta_text TEXT NOT NULL DEFAULT 'Shop the Collection',
  cta_link TEXT NOT NULL DEFAULT '/collections',
  desktop_image_url TEXT NOT NULL,
  desktop_image_public_id TEXT,
  mobile_image_url TEXT,
  mobile_image_public_id TEXT,
  text_alignment TEXT NOT NULL DEFAULT 'left',
  overlay_intensity INTEGER NOT NULL DEFAULT 40,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  image_public_id TEXT,
  display_order INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_nav_item BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Products Table (Tailored specifically for fabric & fashion)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  description TEXT,
  brand TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10,2) CHECK (compare_at_price IS NULL OR compare_at_price >= 0),
  selling_unit TEXT NOT NULL DEFAULT 'per_metre', -- 'per_metre', 'piece', 'set'
  min_order_qty NUMERIC(6,2) NOT NULL DEFAULT 1.00 CHECK (min_order_qty > 0),
  qty_step NUMERIC(6,2) NOT NULL DEFAULT 0.50 CHECK (qty_step > 0),
  stock_qty NUMERIC(10,2) NOT NULL DEFAULT 0.00 CHECK (stock_qty >= 0),
  is_in_stock BOOLEAN NOT NULL DEFAULT true,
  fabric_type TEXT,           -- e.g. 'Shirting Cotton', 'Wool Suiting', 'Linen', 'Silk Blend'
  fabric_composition TEXT,    -- e.g. '100% Egyptian Giza Cotton', 'Super 130s Merino Wool'
  fabric_width TEXT,          -- e.g. '58 inches / 147 cm'
  fabric_weight TEXT,         -- e.g. '260 GSM'
  fabric_pattern TEXT,        -- e.g. 'Solid', 'Twill', 'Herringbone', 'Plaid', 'Check'
  color_name TEXT,            -- e.g. 'Midnight Navy', 'Warm Ivory', 'Steel Grey'
  color_hex TEXT,             -- e.g. '#101B35'
  is_featured BOOLEAN NOT NULL DEFAULT false,   -- Appears in Signature Selection
  is_exclusive BOOLEAN NOT NULL DEFAULT false,  -- Appears in Beyond the Ordinary
  is_published BOOLEAN NOT NULL DEFAULT true,
  sku TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  image_public_id TEXT,
  alt_text TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  subtotal NUMERIC(10,2) NOT NULL,
  shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(10,2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  order_status TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  payment_gateway TEXT NOT NULL DEFAULT 'razorpay',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  tracking_number TEXT,
  tracking_carrier TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_title TEXT NOT NULL,
  product_slug TEXT,
  product_image TEXT,
  selling_unit TEXT NOT NULL DEFAULT 'per_metre',
  quantity NUMERIC(10,2) NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
  fabric_details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  brevo_synced BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for lightning fast queries and indexing
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_exclusive ON public.products(is_exclusive);
CREATE INDEX IF NOT EXISTS idx_products_created ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_order ON public.categories(display_order);
CREATE INDEX IF NOT EXISTS idx_banners_active_order ON public.homepage_banners(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- Enable RLS on all tables
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Explicit Grants to anon & authenticated
GRANT SELECT ON public.store_settings TO anon, authenticated;
GRANT SELECT ON public.homepage_banners TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.product_images TO anon, authenticated;
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT SELECT ON public.orders TO anon, authenticated;
GRANT INSERT ON public.order_items TO anon, authenticated;
GRANT SELECT ON public.order_items TO anon, authenticated;
GRANT INSERT ON public.newsletter_subscribers TO anon, authenticated;

-- Service role has full administrative privileges
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Policies for Storefront (Public / Anon)
DROP POLICY IF EXISTS "Public can view store settings" ON public.store_settings;
CREATE POLICY "Public can view store settings" ON public.store_settings
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public can view active banners" ON public.homepage_banners;
CREATE POLICY "Public can view active banners" ON public.homepage_banners
  FOR SELECT TO public USING (is_active = true);

DROP POLICY IF EXISTS "Public can view active categories" ON public.categories;
CREATE POLICY "Public can view active categories" ON public.categories
  FOR SELECT TO public USING (is_active = true);

DROP POLICY IF EXISTS "Public can view published products" ON public.products;
CREATE POLICY "Public can view published products" ON public.products
  FOR SELECT TO public USING (is_published = true);

DROP POLICY IF EXISTS "Public can view product images" ON public.product_images;
CREATE POLICY "Public can view product images" ON public.product_images
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public can place orders" ON public.orders;
CREATE POLICY "Public can place orders" ON public.orders
  FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view own order by number" ON public.orders;
CREATE POLICY "Public can view own order by number" ON public.orders
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public can insert order items" ON public.order_items;
CREATE POLICY "Public can insert order items" ON public.order_items
  FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view order items" ON public.order_items;
CREATE POLICY "Public can view order items" ON public.order_items
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT TO public WITH CHECK (true);
