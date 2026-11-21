import StoreLayout from "@/components/layout/StoreLayout";
import { getStoreSettings, getCategories } from "@/lib/data";

export default async function TermsPage() {
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
            Terms &amp; Conditions
          </h1>
          <div className="w-12 h-[1px] bg-gold my-4" />
          
          <div className="prose prose-sm text-charcoal space-y-4 font-light leading-relaxed">
            <p>
              By accessing the FAB BASIC storefront or commissioning fabric orders, you agree to be bound by these terms and conditions.
            </p>
            <h3 className="font-serif text-lg text-navy font-normal pt-2">
              Fabric Visual Representation
            </h3>
            <p>
              We photograph all fabrics under color-calibrated natural daylight studio conditions. However, variations in screen calibration may slightly alter the perception of cloth hues.
            </p>
            <h3 className="font-serif text-lg text-navy font-normal pt-2">
              Meterage &amp; Cutting
            </h3>
            <p>
              Fabric measurements are conducted using professional cloth-metering rulers with pinked edges to prevent fraying.
            </p>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
