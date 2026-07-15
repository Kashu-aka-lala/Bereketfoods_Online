"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import clsx from "clsx";

export interface ProductCardProps {
  id: string;
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
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      name,
      price: parseFloat(price),
      imageUrl: imageUrl ?? "/logo.png",
      weight: weight ?? undefined,
    });
  };

  const priceNum = parseFloat(price);
  const comparePriceNum = comparePrice ? parseFloat(comparePrice) : null;
  const discount =
    comparePriceNum && comparePriceNum > priceNum
      ? Math.round(((comparePriceNum - priceNum) / comparePriceNum) * 100)
      : null;
  const badgeStyle = badge
    ? (BADGE_STYLES[badge] ?? "bg-[var(--color-gold)] text-white")
    : null;

  return (
    <Link
      href={`/products/${slug}`}
      className="group flex flex-col bg-white rounded-xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* ── Image: fixed 4:3 ratio — no more vertical stretching ── */}
      <div className="relative aspect-[16/9] w-full bg-neutral-50 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 object-top"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🌿</span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
        >
          <Heart
            className={clsx("w-3 h-3", isLiked && "fill-red-500 text-red-500")}
          />
        </button>

        {/* Badges — top left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {badge && badgeStyle && (
            <span
              className={clsx(
                "text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide",
                badgeStyle
              )}
            >
              {badge}
            </span>
          )}
          {discount && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">
              -{discount}%
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white text-[10px] font-semibold bg-black/60 px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* ── Details: flex-1 so all cards align at the bottom ── */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand */}
          {brand && (
            <p className="text-[9px] font-semibold text-[var(--color-gold)] uppercase tracking-wider mb-0.5">
              {brand}
            </p>
          )}

          {/* Stars */}
          <div className="flex items-center gap-0.5 mb-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={clsx(
                  "w-2.5 h-2.5",
                  s <= 4
                    ? "fill-[var(--color-gold)] text-[var(--color-gold)]"
                    : "text-gray-200"
                )}
              />
            ))}
            <span className="text-[9px] text-gray-400 ml-1">(42)</span>
          </div>

          {/* Title */}
          <h3 className="text-xs font-semibold text-neutral-800 line-clamp-1 group-hover:text-[var(--color-gold)] transition-colors">
            {name}
          </h3>

          {/* Description */}
          <p className="text-[10px] text-neutral-400 mt-0.5 line-clamp-2 min-h-[28px] leading-relaxed">
            {shortDescription ||
              "Premium quality product sourced and packed with care."}
          </p>

          {/* Weight */}
          {weight && (
            <p className="text-[9px] text-gray-400 mt-0.5 font-medium">{weight}</p>
          )}
        </div>

        {/* ── Price & CTA ── */}
        <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-900">
              Rs. {priceNum.toLocaleString()}
            </span>
            {comparePriceNum && comparePriceNum > priceNum && (
              <span className="text-[10px] text-gray-400 line-through ml-1">
                Rs. {comparePriceNum.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={clsx(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all duration-200",
              inStock
                ? "bg-[var(--color-forest)] text-white hover:bg-[#2d5235] hover:shadow-md"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
            aria-label={`Add ${name} to cart`}
          >
            <ShoppingCart className="w-3 h-3" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
