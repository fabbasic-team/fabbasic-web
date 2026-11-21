import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types";

interface CategoryGridProps {
  categories: Category[];
}

// Fallback category definitions if admin has not yet added categories to Supabase
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Shirting Fabrics",
    slug: "shirting-fabrics",
    description: "Egyptian Giza Cotton, Italian linens, and bespoke shirt weaves.",
    image_url:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    display_order: 1,
    is_active: true,
    is_nav_item: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    name: "Suiting Fabrics",
    slug: "suiting-fabrics",
    description: "Refined worsted wools, tropical blends, and structured tailoring cuts.",
    image_url:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    display_order: 2,
    is_active: true,
    is_nav_item: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    name: "Exclusive Luxury Suiting Fabrics",
    slug: "exclusive-luxury-suiting",
    description: "Super 130s to 180s wool, cashmere blends, and rare textile house cloth.",
    image_url:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    display_order: 3,
    is_active: true,
    is_nav_item: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "4",
    name: "Readymade",
    slug: "readymade",
    description: "Artisanal tailored kurtas, bandhgalas, and premium tailored essentials.",
    image_url:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    display_order: 4,
    is_active: true,
    is_nav_item: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "5",
    name: "Dhoti / Veshti",
    slug: "dhoti-veshti",
    description: "Heritage South Indian pure cotton and silk border dhotis and veshtis.",
    image_url:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    display_order: 5,
    is_active: true,
    is_nav_item: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "6",
    name: "Accessories",
    slug: "accessories",
    description: "Mother-of-pearl buttons, silk pocket squares, and tailoring essentials.",
    image_url:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    display_order: 6,
    is_active: true,
    is_nav_item: true,
    created_at: "",
    updated_at: "",
  },
];

export default function CategoryGrid({ categories }: CategoryGridProps) {
  const displayList = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <section className="py-16 sm:py-24 bg-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-[11px] sm:text-xs uppercase tracking-widest text-gold font-semibold mb-2">
            EXPLORE OUR COLLECTIONS
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-navy font-light tracking-tight">
            A Fabric for Every Style
          </h2>
          <div className="w-12 h-[1px] bg-gold mx-auto my-4" />
          <p className="text-sm sm:text-base text-charcoal font-light leading-relaxed">
            A considered selection of fabrics for every expression of style.
          </p>
        </div>

        {/* 6 Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {displayList.map((cat) => (
            <Link
              key={cat.id || cat.slug}
              href={`/collections/${cat.slug}`}
              className="group flex flex-col bg-white border border-beige-border hover:border-gold/60 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
            >
              {/* Category Image */}
              <div className="relative aspect-[4/5] w-full bg-beige-subtle overflow-hidden">
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-4 bg-navy-surface text-center">
                    <span className="text-xs text-gold/80 font-serif tracking-wider uppercase">
                      {cat.name}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-navy-deep/10 group-hover:bg-navy-deep/0 transition-colors duration-300" />
              </div>

              {/* Caption */}
              <div className="p-3 sm:p-4 text-center flex-1 flex flex-col justify-center bg-white border-t border-beige-border/40">
                <h3 className="text-xs sm:text-sm font-medium text-navy group-hover:text-gold transition-colors duration-200 line-clamp-2">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
