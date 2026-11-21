import StoreLayout from "@/components/layout/StoreLayout";
import { getStoreSettings, getCategories } from "@/lib/data";

export default async function PrivacyPolicyPage() {
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
            Privacy Policy
          </h1>
          <div className="w-12 h-[1px] bg-gold my-4" />
          
          <div className="prose prose-sm text-charcoal space-y-4 font-light leading-relaxed">
            <p>
              FAB BASIC is dedicated to safeguarding the privacy and personal data of our esteemed patrons. This Privacy Policy details our practices concerning personal data collected through our website.
            </p>
            <h3 className="font-serif text-lg text-navy font-normal pt-2">
              Information We Collect
            </h3>
            <p>
              We collect information provided directly by you when placing orders, subscribing to the FAB BASIC Gazette, or communicating with our client care team. This includes your name, email address, telephone number, and delivery address.
            </p>
            <h3 className="font-serif text-lg text-navy font-normal pt-2">
              Payment Security
            </h3>
            <p>
              All payment transactions are encrypted and processed through certified PCI-DSS compliant gateways (Razorpay). FAB BASIC does not store card details on our servers.
            </p>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
