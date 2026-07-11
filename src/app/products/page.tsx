import { getShopifyProducts } from "@/lib/shopify";
import ProductCard from "@/components/ProductCard";

export default async function ProductsPage() {
  const shopifyProducts = await getShopifyProducts();

  // Map the new live Shopify data structures directly into your existing layout props
  const formattedProducts = shopifyProducts.map(({ node }: any) => ({
    id: node.id,
    slug: node.handle,
    name: node.title,
    description: node.description,
    price: node.variants.edges[0]?.node.price.amount,
    imageUrl: node.images.edges[0]?.node.url || "/logo.png",
    category: node.productType,
    brand: node.vendor,
    variantId: node.variants.edges[0]?.node.id
  }));

  return (
    <main className="bg-cream min-h-screen p-8">
      <h1 className="font-serif text-4xl text-charcoal mb-8 text-center">
        Our Premium Natural Foods
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {formattedProducts.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
