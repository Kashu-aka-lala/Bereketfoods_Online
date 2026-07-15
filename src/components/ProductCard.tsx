"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Heart, Eye } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import clsx from "clsx";

export interface ProductCardProps {
  id: string; // Shopify GID string e.g. "gid://shopify/Product/123"
  slug: string;
  name: string;
  shortDescription?: string | null;
  price: string;
  comparePrice?: string | null;
  imageUrl?: string | null;
  category?: string | null;
  weight?: string | null;
  badge?: string | null;
  inStock?: boolean | null;
  brand?: string | null;
}

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-[var(--color-gold)] text-white",
  "New": "bg-[var(--color-forest)] text-white",
  "Fan Favorite": "bg-[#8B7240] text-white",
  "Organic": "bg-[var(--color-forest)] text-white",
  "Artisan": "bg-[#A68B4D] text-white",
  "Raw & Pure": "bg-[var(--color-gold)] text-white",
  "Complete Protein": "bg-[var(--color-forest)] text-white",
  "Limited Edition": "bg-[#7A5A3D] text-white",
  "Sale": "bg-red-500 text-white",
  "Hot": "bg-orange-500 text-white",
};

export default function ProductCard({
  id,
  slug,
  name,
  shortDescription,
  price,
  comparePrice,
  imageUrl,
  weight,
  badge,
  inStock = true,
  brand,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      name,
      price: parseFloat(price),
      imageUrl: imageUrl ?? "/images/product-muesli.jpg",
      weight: weight ?? undefined,
    });
  };

  const priceNum = parseFloat(price);
  const comparePriceNum = comparePrice ? parseFloat(comparePrice) : null;
  const discount = comparePriceNum ? Math.round(((comparePriceNum - priceNum) / comparePriceNum) * 100) : null;
  const badgeStyle = badge ? (BADGE_STYLES[badge] ?? "bg-[var(--color-gold)] text-white") : null;

  return (
    <Link
      href={`/products/${slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[var(--color-gold)]/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-[var(--color-cream)] overflow-hidden">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><span className="text-5xl">🌿</span></div>
        )}

        {/* Hover Actions */}
        <div className={clsx("absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300", isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2")}>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsLiked(!isLiked); }} className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-all">
            <Heart className={clsx("w-4 h-4", isLiked && "fill-red-500 text-red-500")} />
          </button>
          <button className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-[var(--color-gold)] hover:scale-110 transition-all">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {badge && badgeStyle && <span className={clsx("text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide", badgeStyle)}>{badge}</span>}
          {discount && discount > 0 && <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-500 text-white">-{discount}%</span>}
        </div>

        {!inStock && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="text-white text-sm font-semibold bg-black/60 px-4 py-2 rounded-full">Out of Stock</span></div>}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Brand */}
        {brand && <p className="text-xs font-medium text-[var(--color-gold)] mb-1">{brand}</p>}
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={clsx("w-3 h-3", s <= 4 ? "fill-[var(--color-gold)] text-[var(--color-gold)]" : "text-gray-200")} />)}
          <span className="text-xs text-gray-400 ml-1">(42)</span>
        </div>

        <h3 className="text-base font-bold text-[var(--color-charcoal)] leading-snug line-clamp-1 group-hover:text-[var(--color-gold)] transition-colors">{name}</h3>
        {shortDescription && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-2">{shortDescription}</p>}
        {weight && <p className="text-xs text-gray-400 mt-1.5 font-medium">{weight}</p>}

        {/* Price & CTA */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-[var(--color-charcoal)]">Rs. {priceNum.toLocaleString()}</span>
            {comparePriceNum && comparePriceNum > priceNum && <span className="text-sm text-gray-400 line-through ml-2">Rs. {comparePriceNum.toLocaleString()}</span>}
          </div>
          <button onClick={handleAddToCart} disabled={!inStock} className={clsx("w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200", inStock ? "bg-[var(--color-gold)] text-white hover:bg-[#A68B4D] hover:scale-110 shadow-md" : "bg-gray-200 text-gray-400 cursor-not-allowed")} aria-label={`Add ${name} to cart`}>
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
