import StoreLayout from "@/components/layout/StoreLayout";
import { getStoreSettings, getCategories } from "@/lib/data";

export default async function ReturnPolicyPage() {
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
            Returns &amp; Exchange Policy
          </h1>
          <div className="w-12 h-[1px] bg-gold my-4" />
          
          <div className="prose prose-sm text-charcoal space-y-4 font-light leading-relaxed">
            <h3 className="font-serif text-lg text-navy font-normal">
              Custom-Cut Fabrics
            </h3>
            <p>
              Because fabric sold by the metre is custom-cut from master bolts specifically to your commissioned length, cut fabrics cannot be returned or exchanged unless there is an intrinsic manufacturing defect or error in the sent meterage.
            </p>
            <h3 className="font-serif text-lg text-navy font-normal pt-2">
              Defects or Damaged Parcels
            </h3>
            <p>
              In the unlikely event of receiving damaged or defective cloth, please notify our client concierge at {settings.contact_email} within 48 hours of delivery along with photographic evidence. We will arrange an immediate replacement or full refund.
            </p>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
