export type SellingUnit = "per_metre" | "piece" | "set";

export interface EditorialFeatureSettings {
  is_active: boolean;
  image_url: string | null;
  image_public_id?: string | null;
  card_tag?: string;
  card_title?: string;
  card_features?: string[];
  eyebrow: string;
  heading: string;
  text_1: string;
  text_2?: string;
  cta_text: string;
  cta_link: string;
}

export interface StoreSettings {
  id: string;
  site_name: string;
  tagline: string;
  announcement_active: boolean;
  announcement_text: string;
  announcement_link: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  whatsapp_number: string;
  instagram_url: string;
  facebook_url: string;
  brand_story_heading: string;
  brand_story_subheading: string;
  brand_story_text: string;
  brand_story_image: string | null;
  editorial_feature?: EditorialFeatureSettings;
  signature_selection_heading: string;
  signature_selection_subheading: string;
  exclusive_collection_heading: string;
  exclusive_collection_subheading: string;
  free_shipping_threshold: number;
  standard_shipping_fee: number;
  currency: string;
  currency_symbol: string;
  razorpay_key_id?: string;
  razorpay_key_secret?: string;
  brevo_api_key?: string;
  updated_at: string;
}

export interface HomepageBanner {
  id: string;
  title: string;
  eyebrow?: string | null;
  subtitle?: string | null;
  cta_text: string;
  cta_link: string;
  desktop_image_url: string;
  desktop_image_public_id?: string | null;
  mobile_image_url?: string | null;
  mobile_image_public_id?: string | null;
  text_alignment: "left" | "center" | "right";
  overlay_intensity: number;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  image_public_id?: string | null;
  display_order: number;
  is_active: boolean;
  is_nav_item: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  image_public_id?: string | null;
  alt_text?: string | null;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category_id?: string | null;
  category?: Category;
  description?: string | null;
  brand?: string | null;
  price: number;
  compare_at_price?: number | null;
  selling_unit: SellingUnit;
  min_order_qty: number;
  qty_step: number;
  stock_qty: number;
  is_in_stock: boolean;
  fabric_type?: string | null;
  fabric_composition?: string | null;
  fabric_width?: string | null;
  fabric_weight?: string | null;
  fabric_pattern?: string | null;
  color_name?: string | null;
  color_hex?: string | null;
  is_featured: boolean;
  is_exclusive: boolean;
  is_published: boolean;
  sku?: string | null;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  slug: string;
  price: number;
  sellingUnit: SellingUnit;
  quantity: number;
  image: string;
  brand?: string;
  composition?: string;
  width?: string;
  colorName?: string;
  maxStock: number;
  minOrderQty: number;
  qtyStep: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderStatus = "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress | null;
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  total_amount: number;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  payment_gateway: string;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  tracking_number?: string | null;
  tracking_carrier?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string | null;
  product_title: string;
  product_slug?: string | null;
  product_image?: string | null;
  selling_unit: SellingUnit;
  quantity: number;
  unit_price: number;
  total_price: number;
  fabric_details?: Record<string, any>;
  created_at: string;
}
