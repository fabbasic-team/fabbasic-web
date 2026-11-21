import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight, Package, Clock, ShieldCheck } from "lucide-react";
import StoreLayout from "@/components/layout/StoreLayout";
import { getStoreSettings, getCategories } from "@/lib/data";

interface OrderSuccessPageProps {
  searchParams: Promise<{ order?: string; status?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const { order, status } = await searchParams;
  const [settings, categories] = await Promise.all([
    getStoreSettings(),
    getCategories(),
  ]);

  const orderNum = order || "FB-2026-CONFIRMED";

  return (
    <StoreLayout settings={settings} categories={categories}>
      <div className="py-16 sm:py-24 bg-ivory">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-gold/10 text-gold mx-auto flex items-center justify-center border border-gold/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <p className="text-xs uppercase tracking-luxury text-gold font-semibold mb-2">
              BESPOKE ORDER CONFIRMED
            </p>
            <h1 className="text-3xl sm:text-5xl font-serif text-navy font-light tracking-tight">
              Thank You for Your Order
            </h1>
            <p className="text-sm sm:text-base text-charcoal font-light mt-3 max-w-lg mx-auto leading-relaxed">
              We have received your fabric order. Our clothiers have begun preparing your bolts for cutting and packaging.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white p-6 sm:p-8 border border-beige-border rounded-sm shadow-sm text-left space-y-4">
            <div className="flex items-center justify-between border-b border-beige-border pb-4">
              <div>
                <span className="text-xs text-charcoal/70 uppercase tracking-subtle block">
                  Order Number
                </span>
                <span className="font-mono font-bold text-navy text-lg sm:text-xl">
                  {orderNum}
                </span>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold uppercase tracking-luxury rounded border border-green-200">
                Confirmed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-charcoal pt-2">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-navy block">Cutting &amp; Inspection</span>
                  <span>Dispatched within 24-48 business hours.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-navy block">Insured Delivery</span>
                  <span>Tracking details sent via email and SMS.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/collections"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-navy hover:bg-navy-deep text-ivory text-xs uppercase tracking-luxury font-semibold transition-colors rounded shadow"
            >
              <span>Continue Exploring Fabrics</span>
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>

        </div>
      </div>
    </StoreLayout>
  );
}
