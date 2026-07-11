import { getShopifyProducts } from "@/lib/shopify";
import { notFound } from "next/navigation";
import Image from "next/image";

// Clean up: Removed Drizzle imports completely!

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const allProducts = await getShopifyProducts();
  
  // Find the matched product by its Shopify handle/slug
  const matchedProduct = allProducts.find(({ node }: any) => node.handle === params.slug);

  if (!matchedProduct) {
    notFound();
  }

  const product = {
    title: matchedProduct.node.title,
    description: matchedProduct.node.description,
    price: matchedProduct.node.variants.edges[0]?.node.price.amount,
    imageUrl: matchedProduct.node.images.edges[0]?.node.url || "/logo.png",
    vendor: matchedProduct.node.vendor,
  };

  return (
    <main className="max-w-4xl mx-auto p-8 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm">
          <Image 
            src={product.imageUrl} 
            alt={product.title} 
            fill 
            className="object-contain p-4"
          />
        </div>
        <div className="flex flex-col justify-center">
          <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">{product.vendor}</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">{product.title}</h1>
          <p className="text-2xl font-semibold text-gray-800 mb-6">Rs. {product.price}</p>
          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm">
            Add to Cart
          </button>
        </div>
      </div>
    </main>
  );
}
