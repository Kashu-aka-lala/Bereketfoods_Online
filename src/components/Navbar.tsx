"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Search, User, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import clsx from "clsx";

const CATEGORIES = [
  { name: "Breakfast Cereals", href: "/products?category=Breakfast+Cereals" },
  { name: "Granola & Snacks", href: "/products?category=Granola+&+Snacks" },
  { name: "Superfoods", href: "/products?category=Superfoods" },
  { name: "Jams & Condiments", href: "/products?category=Jams+&+Condiments" },
  { name: "Natural Sweeteners", href: "/products?category=Natural+Sweeteners" },
];

export default function Navbar() {
  const { getItemCount, openCart } = useCartStore();
  const [itemCount, setItemCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => {
    setItemCount(getItemCount());
    const unsubscribe = useCartStore.subscribe((state) => setItemCount(state.getItemCount()));
    return () => unsubscribe();
  }, [getItemCount]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className={clsx("fixed top-0 left-0 right-0 z-50 transition-all duration-300", scrolled ? "bg-white/95 backdrop-blur-md shadow-lg shadow-black/5" : "bg-white/90 backdrop-blur-sm")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-forest)] flex items-center justify-center overflow-hidden group-hover:bg-[var(--color-gold)] transition-colors duration-300">
              <Image src="/logo.png" alt="Bereket Foods" width={36} height={36} className="object-contain" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold text-[var(--color-charcoal)] tracking-tight">Bereket Foods</span>
              <span className="text-[10px] font-medium text-[var(--color-gold)] tracking-[0.2em] uppercase">Foods</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-[var(--color-forest)] transition-colors rounded-lg hover:bg-[var(--color-cream)]">
                {link.label}
              </Link>
            ))}
            <div className="relative" onMouseEnter={() => setCategoriesOpen(true)} onMouseLeave={() => setCategoriesOpen(false)}>
              <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-600 hover:text-[var(--color-forest)] transition-colors rounded-lg hover:bg-[var(--color-cream)]">
                Categories <ChevronDown className={clsx("w-4 h-4 transition-transform", categoriesOpen && "rotate-180")} />
              </button>
              <div className={clsx("absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200", categoriesOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none")}>
                {CATEGORIES.map((cat) => (
                  <Link key={cat.name} href={cat.href} className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[var(--color-cream)] hover:text-[var(--color-gold)] transition-colors">
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full bg-[var(--color-cream)] text-gray-500 hover:text-[var(--color-gold)] hover:scale-105 transition-all">
              <Search className="w-4 h-4" />
            </button>
            <button onClick={openCart} className="relative flex items-center gap-2 bg-[var(--color-forest)] text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[var(--color-gold)] transition-colors shadow-lg shadow-[var(--color-forest)]/20">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-gold)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{itemCount > 9 ? "9+" : itemCount}</span>}
            </button>
            <button className="lg:hidden p-2.5 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={clsx("lg:hidden bg-white border-t border-gray-100 transition-all duration-300", menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden")}>
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-gray-600 hover:bg-[var(--color-cream)] hover:text-[var(--color-forest)] rounded-lg transition-colors">
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100">
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} href={cat.href} onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm text-gray-500 hover:bg-[var(--color-cream)] hover:text-[var(--color-gold)] rounded-lg transition-colors">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
