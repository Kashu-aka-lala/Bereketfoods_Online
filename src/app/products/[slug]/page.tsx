import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import ProductPageClient from "./ProductPageClient";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug));
    if (!product) return { title: "Product Not Found" };
    return {
      title: product.name,
      description: product.shortDescription ?? product.description,
      openGraph: {
        title: `${product.name} | Bereket Foods`,
        description: product.shortDescription ?? undefined,
        images: product.imageUrl ? [product.imageUrl] : [],
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  let product: typeof products.$inferSelect | null = null;
  try {
    const [found] = await db
      .select()
      .from(products)
      .where(eq(products.slug, slug));
    product = found ?? null;
  } catch {
    product = null;
  }

  if (!product) notFound();

  const priceNum = parseFloat(product.price);
  const comparePriceNum = product.comparePrice
    ? parseFloat(product.comparePrice)
    : null;
  const discount =
    comparePriceNum
      ? Math.round(((comparePriceNum - priceNum) / comparePriceNum) * 100)
      : null;

  const benefits = (product.benefits as string[]) ?? [];
  const nutritionalFacts =
    (product.nutritionalFacts as {
      label: string;
      value: string;
      per100g?: string;
    }[]) ?? [];
  const certifications = (product.certifications as string[]) ?? [];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-sm text-[#6b7c6b]">
          <Link href="/" className="hover:text-[var(--color-forest)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-[var(--color-forest)] transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-[#1a2e1c] font-medium line-clamp-1">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#f5f0e8]">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  quality={95}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🌿
                </div>
              )}

              {product.badge && (
                <span className="absolute top-4 left-4 bg-[#c8a24a] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  -{discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Category */}
            {product.category && (
              <Link
                href={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-bold text-[var(--color-forest)] uppercase tracking-[0.15em] hover:underline mb-3"
              >
                {product.category}
              </Link>
            )}

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1a2e1c] leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={
                      s <= 4 ? "text-[#c8a24a] text-lg" : "text-[#e0d9c8] text-lg"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-[#6b7c6b]">
                4.0 · Verified Buyers
              </span>
            </div>

            {product.shortDescription && (
              <p className="text-[#3a3a2e] leading-relaxed mb-6">
                {product.shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#1a2e1c]">
                Rs. {priceNum.toLocaleString()}
              </span>
              {comparePriceNum && (
                <span className="text-lg text-[#9a9080] line-through">
                  Rs. {comparePriceNum.toLocaleString()}
                </span>
              )}
              {discount && (
                <span className="text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Weight & Stock */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {product.weight && (
                <span className="text-sm bg-[#f5f0e8] text-[#3a3a2e] px-3 py-1.5 rounded-full font-medium">
                  📦 {product.weight}
                </span>
              )}
              <span
                className={`text-sm px-3 py-1.5 rounded-full font-medium ${
                  product.inStock
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
              </span>
            </div>

            {/* Add to Cart - Client Component */}
            <ProductPageClient
              productId={product.id}
              productName={product.name}
              productPrice={priceNum}
              productImageUrl={product.imageUrl ?? ""}
              productWeight={product.weight}
              inStock={product.inStock ?? true}
            />

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="mt-6 p-4 bg-[#f5f0e8] rounded-2xl">
                <p className="text-xs font-bold text-[var(--color-forest)] uppercase tracking-wide mb-2">
                  Certifications
                </p>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((cert) => (
                    <div
                      key={cert}
                      className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#e0d9c8]"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-[var(--color-forest)]" />
                      <span className="text-xs font-medium text-[#3a3a2e]">
                        {cert}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Tabs: Details, Ingredients, Nutrition ──────── */}
        <div className="mt-14 space-y-8">
          {/* Description */}
          {product.description && (
            <section className="bg-white rounded-3xl p-8 border border-[#f0ece0]">
              <h2 className="font-serif text-2xl font-bold text-[#1a2e1c] mb-5">
                About This Product
              </h2>
              <p className="text-[#3a3a2e] leading-relaxed">{product.description}</p>
            </section>
          )}

          {/* Benefits */}
          {benefits.length > 0 && (
            <section className="bg-white rounded-3xl p-8 border border-[#f0ece0]">
              <h2 className="font-serif text-2xl font-bold text-[#1a2e1c] mb-5">
                Key Benefits
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[var(--color-forest)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[var(--color-forest)]" />
                    </div>
                    <p className="text-sm text-[#3a3a2e] leading-relaxed">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Ingredients */}
          {product.ingredients && (
            <section className="bg-white rounded-3xl p-8 border border-[#f0ece0]">
              <h2 className="font-serif text-2xl font-bold text-[#1a2e1c] mb-5">
                Ingredients
              </h2>
              <p className="text-sm text-[#3a3a2e] leading-relaxed bg-[#f5f0e8] p-4 rounded-2xl">
                {product.ingredients}
              </p>
            </section>
          )}

          {/* Nutritional Facts */}
          {nutritionalFacts.length > 0 && (
            <section className="bg-white rounded-3xl p-8 border border-[#f0ece0]">
              <h2 className="font-serif text-2xl font-bold text-[#1a2e1c] mb-2">
                Nutritional Facts
              </h2>
              <p className="text-xs text-[#6b7c6b] mb-5">
                Typical values per 100g as sold
              </p>
              <div className="overflow-x-auto rounded-2xl border border-[#f0ece0]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#1a2e1c]">
                      <th className="text-left px-5 py-3 font-semibold text-white rounded-tl-xl">
                        Nutrient
                      </th>
                      <th className="text-right px-5 py-3 font-semibold text-white rounded-tr-xl">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {nutritionalFacts.map((fact, i) => (
                      <tr
                        key={i}
                        className={
                          i % 2 === 0 ? "bg-white" : "bg-[var(--color-cream)]"
                        }
                      >
                        <td className="px-5 py-3 text-[#3a3a2e] font-medium">
                          {fact.label}
                        </td>
                        <td className="px-5 py-3 text-right text-[#1a2e1c] font-bold">
                          {fact.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-[#9a9080] mt-3">
                * Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
              </p>
            </section>
          )}
        </div>

        {/* Back to Products */}
        <div className="mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-forest)] hover:text-[#2d5235] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to All Products
          </Link>
        </div>
      </div>
    </div>
  );
}
