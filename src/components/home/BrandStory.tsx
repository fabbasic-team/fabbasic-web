import Image from "next/image";
import { StoreSettings } from "@/types";

export default function BrandStory({ settings }: { settings: StoreSettings }) {
  return (
    <section className="py-20 sm:py-28 bg-white border-t border-beige-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        
        {/* Brand Logo Emblem */}
        <div className="flex justify-center mb-4">
          <div className="w-36 sm:w-44 h-10 sm:h-12 relative">
            <Image
              src="/fab_basic_logo_transparent.png"
              alt="FAB BASIC"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <p className="text-xs uppercase tracking-luxury text-gold font-semibold">
          {settings.brand_story_subheading || "Curated by Master Clothiers"}
        </p>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-navy font-light tracking-tight">
          {settings.brand_story_heading || "A Tradition of Style. A Standard of Quality."}
        </h2>

        <div className="w-16 h-[1.5px] bg-gold mx-auto my-6" />

        <p className="text-base sm:text-lg text-charcoal leading-relaxed font-light max-w-2xl mx-auto">
          {settings.brand_story_text ||
            "At FAB BASIC, we believe tailoring begins with extraordinary cloth. From prestigious European mills to artisanal Indian handloom masters, our textiles are chosen for exceptional drape, durability, and hand-feel."}
        </p>

        <p className="text-xs tracking-widest text-navy/60 uppercase font-medium pt-4">
          STITCH • STYLE • ELEGANCE
        </p>
      </div>
    </section>
  );
}
