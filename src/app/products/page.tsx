import { db } from "@/db";
import { products } from "@/db/schema";
import ProductCard from "@/components/ProductCard";
import { Filter } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Products",
  description:
    "Browse our complete range of premium natural foods — muesli, oats, granola, superfoods, jams, and more. Halal certified and delivered across Pakistan.",
};

const CATEGORIES = [
  "All",
  "Breakfast Cereals",
  "Granola & Snacks",
  "Superfoods",
  "Jams & Condiments",
  "Natural Sweeteners",
];

interface SearchParams {
  category?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const activeCategory = params.category ?? "All";

  let allProducts: (typeof products.$inferSelect)[] = [];
  try {
    allProducts = await db.select().from(products).orderBy(products.id);
  } catch {
    allProducts = [];
  }

  const filteredProducts =
    activeCategory === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-[var(--color-forest)] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--color-forest)]/10 rounded-full blur-2xl" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <p className="text-sm font-semibold text-[var(--color-forest)] uppercase tracking-[0.2em] mb-3">Premium Selection</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">All Products</h1>
          <p className="text-white/70 max-w-lg mx-auto">Discover our complete range of premium natural foods — crafted with nature, backed by science, loved by families.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Filter className="w-4 h-4 text-[var(--color-gold)]" />
            <span className="text-sm font-medium text-gray-500">Filter:</span>
          </div>
          <div className="flex gap-2 flex-nowrap">
            {CATEGORIES.map((cat) => (
              <Link key={cat} href={cat === "All" ? "/products" : `/products?category=${encodeURIComponent(cat)}`}
                className={clsx("flex-shrink-0 text-sm px-5 py-2.5 rounded-full font-medium transition-all duration-200", activeCategory === cat ? "bg-[var(--color-gold)] text-white shadow-lg shadow-[var(--color-gold)]/25" : "bg-white text-gray-600 border border-gray-200 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]")}>
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-[#6b7c6b] mb-6">
          Showing{" "}
          <span className="font-semibold text-[#1a2e1c]">
            {filteredProducts.length}
          </span>{" "}
          product{filteredProducts.length !== 1 ? "s" : ""}
          {activeCategory !== "All" && ` in "${activeCategory}"`}
        </p>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                shortDescription={product.shortDescription}
                price={product.price}
                comparePrice={product.comparePrice}
                imageUrl={product.imageUrl}
                category={product.category}
                weight={product.weight}
                badge={product.badge}
                inStock={product.inStock}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🌿</span>
            <h3 className="text-xl font-bold text-[#1a2e1c] mb-2">
              No products found
            </h3>
            <p className="text-[#6b7c6b] mb-6">
              {allProducts.length === 0
                ? "The database is empty. Please seed the products first."
                : `No products in the "${activeCategory}" category yet.`}
            </p>
            {allProducts.length === 0 && (
              <p className="text-sm text-[#9a9080]">
                Visit{" "}
                <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                  /api/products
                </code>{" "}
                (POST) to seed products.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
