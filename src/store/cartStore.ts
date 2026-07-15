"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string; // Changed from number → string to support Shopify GIDs
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  weight?: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // computed helpers (as store getters)
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        if (process.env.NODE_ENV === "development") {
          console.log("[CartStore] addItem called with:", item);
        }
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
        // Auto-open cart drawer on add
        set({ isOpen: true });
      },

      removeItem: (id) => {
        if (process.env.NODE_ENV === "development") {
          console.log("[CartStore] removeItem called with id:", id);
        }
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => {
        if (process.env.NODE_ENV === "development") {
          console.log("[CartStore] clearCart called");
        }
        set({ items: [] });
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "bereket-cart-storage", // unique key in localStorage
      storage: createJSONStorage(() => localStorage),
      // Only persist items array; isOpen is transient UI state
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (process.env.NODE_ENV === "development") {
          console.log(
            "[CartStore] Rehydrated from localStorage. Items:",
            state?.items
          );
        }
      },
    }
  )
);
