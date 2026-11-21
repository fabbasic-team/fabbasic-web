# FAB BASIC – Premium Fabric E-Commerce & Editorial CMS

> **STITCH • STYLE • ELEGANCE**

An ultra-premium, production-ready fabric e-commerce platform and editorial Content Management System (CMS) designed for high-end tailoring, bespoke shirting, luxury worsted wool suiting, and heritage Indian weaves.

---

## 💎 Features & Architecture

### 1. Storefront Experience
- **Editorial Atmosphere**: Inspired by luxury Savile Row tailoring houses and international textile archives.
- **Controlled Luxury Palette**: Midnight Navy (`#101B35`), Deep Navy (`#0B1530`), Warm Ivory (`#FAF9F6`), Pure White (`#FFFFFF`), Champagne Gold (`#B99A59`), Soft Beige (`#EAE4D9`), and Warm Grey (`#77736D`).
- **Typography System**: Cormorant Garamond / Playfair Display serif headings paired with clean, modern Manrope sans-serif body.
- **Announcement Bar**: Dynamic announcements, shipping notices, or collection alerts managed via admin.
- **Hero Carousel**: Up to 3 independently managed campaign slides with **separate desktop landscape and mobile portrait images**, auto-slide (paused on hover), touch swipe support, and custom CTA links.
- **Explore Our Collections**: 6 primary fabric categories (Shirting Fabrics, Suiting Fabrics, Exclusive Luxury Suiting, Readymade, Dhoti / Veshti, Accessories).
- **The Latest Edit**: Real-time newly catalogued fabrics from Supabase.
- **The Signature Selection**: Best seller collections flagged by admin or sales volume.
- **Beyond the Ordinary**: Exclusive luxury suiting showcase in deep midnight navy with champagne accents.
- **Brand Story**: "A Tradition of Style. A Standard of Quality." with master clothier storytelling.
- **Brevo Newsletter Integration**: Live email capture with validation and duplicate prevention.
- **Bespoke Shopping Bag Drawer**: Live metre/quantity calculations, unit pricing, and free shipping progress tracker.
- **Instant Search Modal**: Debounced database-backed search across titles, brands, compositions, weaves, and descriptions.

### 2. Fabric-Specific Shopping System
- **Selling by the Metre**: Supports fractional lengths (e.g. 1.5m, 2.0m, 2.5m, 3.25m).
- **Custom Minimums & Increments**: Product-specific minimum cuts (e.g. 1.0m) and step increments (e.g. 0.5m).
- **Technical Fabric Attributes**: Fabric composition (e.g. 100% Egyptian Giza Cotton, Super 130s Merino Wool), fabric width (e.g. 58 inches / 147 cm), weight (GSM), pattern/weave, and colorways with hex swatches.
- **Inventory Protection**: Validates available stock in metres before checkout.

### 3. Comprehensive Admin CMS Dashboard
- **URL**: `/admin` (Protected route)
- **Login**: `/admin/login`
  - **Credentials**: Configured in `.env.local`
- **Modules**:
  - 📊 **Overview**: Real KPI statistics (Products, Active Banners, Categories, Orders, Verified Revenue, Pending Shipments).
  - 🖼️ **Hero Banners**: Upload and manage up to 3 hero banners with separate desktop landscape and mobile portrait uploads to Cloudinary, headings, subheadings, CTA buttons, text alignment, and overlay darkness sliders.
  - 📁 **Categories**: Create and edit categories, upload cover imagery, configure display order, and toggle navigation visibility.
  - ✂️ **Fabric Products**: Add/edit fabrics, set price per metre, custom cutting steps, compositions, widths, weights, patterns, and upload multiple Cloudinary images.
  - 📦 **Orders Management**: View customer orders, fabric cuts, delivery addresses, update fulfillment status, and add tracking carriers & numbers.
  - ⚙️ **Website CMS & Settings**: Edit announcement bar, brand story, client concierge contacts, shipping fees, and API keys.

---

## 🚀 Quick Setup & Database Migration

### 1. Supabase SQL Migration
The project database migration is located at:
`supabase/migrations/20261121000000_fab_basic_init.sql`

To initialize the database in 10 seconds:
1. Open your Supabase Dashboard: [https://supabase.com/dashboard/project/vdkyaxjtmhinmadsfzyp/sql/new](https://supabase.com/dashboard/project/vdkyaxjtmhinmadsfzyp/sql/new)
2. Copy the contents of `supabase/migrations/20261121000000_fab_basic_init.sql`.
3. Paste into the SQL Editor and click **Run**.
4. All tables, Row Level Security (RLS) policies, indexes, and Data API grants will be created instantly.

### 2. Run the Application Locally
```bash
npm install
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) for the storefront or [http://localhost:3000/admin](http://localhost:3000/admin) for the Admin CMS.

---

## 🛡️ Security & Free-Tier Optimization
- **Zero Mock Data**: Dynamic Supabase queries and Cloudinary CDN delivery.
- **Serverless & Edge Efficient**: Aggressive route caching (`revalidate = 60`) on the homepage to prevent excessive Supabase and Vercel quota consumption.
- **Server-Side Validation**: Razorpay payment amounts are verified server-side against database records to prevent client-side tampering.
- **Row Level Security (RLS)**: Public storefront users have read-only access to published products and active banners; all admin writes are strictly authenticated via service role tokens and signed session cookies.
