import { getShopifyProducts } from "@/lib/shopify";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const allProducts = await getShopifyProducts();

  // Find the matched product by its Shopify handle/slug
  const matchedProduct = allProducts.find(
    ({ node }: any) => node.handle === params.slug
  );

  if (!matchedProduct) {
    notFound();
  }

  const { node } = matchedProduct;
  const firstVariant = node.variants.edges[0]?.node;

  const product = {
    id: node.id as string,
    title: node.title as string,
    description: node.description as string,
    price: firstVariant?.price?.amount ?? "0",
    comparePrice: firstVariant?.compareAtPrice?.amount ?? null,
    imageUrl: node.images.edges[0]?.node.url || "/logo.png",
    vendor: node.vendor as string,
    weight:
      firstVariant?.weight && firstVariant?.weightUnit
        ? `${firstVariant.weight} ${firstVariant.weightUnit}`
        : null,
    inStock:
      firstVariant?.availableForSale === true ||
      (node.totalInventory !== null && node.totalInventory > 0),
  };

  const priceNum = parseFloat(product.price);
  const comparePriceNum = product.comparePrice
    ? parseFloat(product.comparePrice)
    : null;
  const discount =
    comparePriceNum && comparePriceNum > priceNum
      ? Math.round(((comparePriceNum - priceNum) / comparePriceNum) * 100)
      : null;

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain p-6"
            priority
          />
          {discount && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              -{discount}% OFF
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center gap-4">
          {product.vendor && (
            <span className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-wider">
              {product.vendor}
            </span>
          )}

          <h1 className="text-3xl font-bold text-[var(--color-charcoal)]">
            {product.title}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-bold text-[var(--color-charcoal)]">
              Rs. {priceNum.toLocaleString()}
            </span>
            {comparePriceNum && comparePriceNum > priceNum && (
              <span className="text-lg text-gray-400 line-through">
                Rs. {comparePriceNum.toLocaleString()}
              </span>
            )}
          </div>

          {/* Weight */}
          {product.weight && (
            <p className="text-sm text-gray-500 font-medium">{product.weight}</p>
          )}

          {/* Stock status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                product.inStock ? "bg-green-500" : "bg-red-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                product.inStock ? "text-green-700" : "text-red-600"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>
          )}

          {/* Add to Cart — client component */}
          <AddToCartButton
            id={product.id}
            name={product.title}
            price={product.price}
            imageUrl={product.imageUrl}
            weight={product.weight}
            inStock={product.inStock}
          />
        </div>
      </div>
    </main>
  );
}
