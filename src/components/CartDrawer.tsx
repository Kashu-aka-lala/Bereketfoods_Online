"use client";

import { useCartStore } from "@/store/cartStore";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getSubtotal,
  } = useCartStore();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        closeCart();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, closeCart]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const subtotal = getSubtotal();
  const shipping = subtotal > 2000 ? 0 : 200;
  const total = subtotal + shipping;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--color-cream)] shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8e3d5]">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-[var(--color-forest)]" />
            <h2 className="text-lg font-bold text-[#1a2e1c]">
              Your Cart
              {items.length > 0 && (
                <span className="ml-2 text-sm font-normal text-[#6b7c6b]">
                  ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-[#f0ece0] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#3a3a2e]" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag className="w-16 h-16 text-[#c8b896] mb-4" />
              <h3 className="text-lg font-semibold text-[#3a3a2e] mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-[#6b7c6b] mb-6">
                Discover our premium natural products
              </p>
              <Link
                href="/products"
                onClick={closeCart}
                className="bg-[var(--color-forest)] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#2d5235] transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white rounded-2xl border border-[#f0ece0]"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#f5f0e8]">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#1a2e1c] leading-snug line-clamp-2">
                      {item.name}
                    </h4>
                    {item.weight && (
                      <p className="text-xs text-[#6b7c6b] mt-0.5">{item.weight}</p>
                    )}
                    <p className="text-sm font-bold text-[var(--color-forest)] mt-1">
                      Rs. {item.price.toLocaleString()}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full border border-[#e0d9c8] flex items-center justify-center hover:bg-[#f0ece0] transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-[#1a2e1c]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full border border-[#e0d9c8] flex items-center justify-center hover:bg-[#f0ece0] transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 hover:bg-red-50 hover:text-red-500 text-[#9a9080] rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#e8e3d5] px-6 py-5 space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[#6b7c6b]">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-[#6b7c6b]">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-[var(--color-forest)] font-medium">Free</span>
                  ) : (
                    `Rs. ${shipping}`
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-[#6b7c6b]">
                  Free shipping on orders over Rs. 2,000
                </p>
              )}
              <div className="flex justify-between text-base font-bold text-[#1a2e1c] pt-2 border-t border-[#f0ece0]">
                <span>Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-[var(--color-forest)] text-white text-center py-3.5 rounded-full font-semibold hover:bg-[#2d5235] transition-colors"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={closeCart}
              className="block w-full text-center py-2 text-sm text-[#6b7c6b] hover:text-[#3a3a2e] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
