import StoreLayout from "@/components/layout/StoreLayout";
import { getStoreSettings, getCategories } from "@/lib/data";

export default async function ShippingPolicyPage() {
  const [settings, categories] = await Promise.all([
    getStoreSettings(),
    getCategories(),
  ]);

  return (
    <StoreLayout settings={settings} categories={categories}>
      <div className="py-16 bg-ivory">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <p className="text-xs uppercase tracking-luxury text-gold font-semibold">
            CLIENT POLICIES
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif text-navy">
            Shipping &amp; Delivery Policy
          </h1>
          <div className="w-12 h-[1px] bg-gold my-4" />
          
          <div className="prose prose-sm text-charcoal space-y-4 font-light leading-relaxed">
            <p>
              At FAB BASIC, we treat every length of cloth with the reverence it deserves. All fabrics are inspected, pinked, and rolled into moisture-resistant protective tubing prior to dispatch.
            </p>
            <h3 className="font-serif text-lg text-navy font-normal pt-2">
              Dispatch Timeframes
            </h3>
            <p>
              Standard fabric orders are cut and dispatched within 24 to 48 business hours from receipt of payment. Insured delivery across metro cities in India typically takes 3 to 5 business days.
            </p>
            <h3 className="font-serif text-lg text-navy font-normal pt-2">
              Complimentary Shipping
            </h3>
            <p>
              We provide complimentary insured shipping across India on all orders exceeding ₹{settings.free_shipping_threshold}. Orders below this threshold carry a standard flat fee of ₹{settings.standard_shipping_fee}.
            </p>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
