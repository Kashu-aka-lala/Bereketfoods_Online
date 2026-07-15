import { getShopifyProducts } from "@/lib/shopify";
import ProductCard, { ProductCardProps } from "@/components/ProductCard";

export default async function ProductsPage() {
  const shopifyProducts = await getShopifyProducts();

  // Map Shopify data to ProductCard props
  const formattedProducts: ProductCardProps[] = shopifyProducts.map(({ node }: any) => {
    const firstVariant = node.variants.edges[0]?.node;
    const inStock =
      firstVariant?.availableForSale === true ||
      (node.totalInventory !== null && node.totalInventory > 0);

    return {
      id: node.id as string,
      slug: node.handle as string,
      name: node.title as string,
      shortDescription: node.description || null,
      price: firstVariant?.price?.amount ?? "0",
      comparePrice: firstVariant?.compareAtPrice?.amount ?? null,
      imageUrl: node.images.edges[0]?.node.url || "/logo.png",
      category: node.productType || null,
      brand: node.vendor || null,
      weight:
        firstVariant?.weight && firstVariant?.weightUnit
          ? `${firstVariant.weight} ${firstVariant.weightUnit}`
          : null,
      inStock,
    };
  });

  return (
    <main className="bg-cream min-h-screen px-6 py-6">
      <h1 className="font-serif text-3xl text-charcoal mb-6 text-center">
        Our Premium Natural Foods
      </h1>

      {formattedProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl mb-2">No products found.</p>
          <p className="text-sm">Check back soon — we&apos;re restocking!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {formattedProducts.map((product) => (
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
              brand={product.brand}
              weight={product.weight}
              inStock={product.inStock}
            />
          ))}
        </div>
      )}
    </main>
  );
}
