import { getShopifyProducts } from "@/lib/shopify";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Leaf, Shield, Zap, Truck, Star, CheckCircle, Menu, X, Search, ShoppingCart, ChevronDown } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let featuredProducts: any[] = [];
  try {
    const allProducts = await getShopifyProducts();
    // Format the shopify products to match the expected ProductCard props
    featuredProducts = allProducts.slice(0, 4).map(({ node }: any) => ({
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
  } catch {
    featuredProducts = [];
  }

  const stats = [
    { value: "100%", label: "Natural Ingredients" },
    { value: "Halal", label: "Certified" },
    { value: "2022", label: "Est. in Pakistan" },
    { value: "Global", label: "Sourcing" },
  ];

  const features = [
    { icon: <Leaf className="w-7 h-7" />, title: "Pure & Natural", description: "Every ingredient carefully sourced from nature with zero artificial additives." },
    { icon: <Shield className="w-7 h-7" />, title: "Halal Certified", description: "Certified by Pakistan Halal Authority — safe for every Muslim household." },
    { icon: <Zap className="w-7 h-7" />, title: "Science-Backed", description: "Formulated with nutritional science to deliver optimal health benefits." },
    { icon: <Truck className="w-7 h-7" />, title: "Fast Delivery", description: "Free shipping across Pakistan on orders over Rs. 2,000." },
  ];

  const brands = ["Jarfull", "Jhat Hazam", "Kuvvet", "Liffest", "Major Grains", "Niwala", "Riverdale"];
  
  const categories = [
    { name: "Breakfast Cereals", emoji: "🥣", description: "Premium muesli, oats & porridges", color: "from-amber-500/20 to-amber-600/10", border: "border-amber-200" },
    { name: "Granola & Snacks", emoji: "🌾", description: "Crunchy honey-baked granola", color: "from-green-500/20 to-green-600/10", border: "border-green-200" },
    { name: "Superfoods", emoji: "✨", description: "Chia seeds, quinoa & more", color: "from-purple-500/20 to-purple-600/10", border: "border-purple-200" },
    { name: "Jams & Condiments", emoji: "🍓", description: "Artisan jams & spreads", color: "from-rose-500/20 to-rose-600/10", border: "border-rose-200" },
    { name: "Natural Sweeteners", emoji: "🍯", description: "Raw honey & alternatives", color: "from-yellow-500/20 to-yellow-600/10", border: "border-yellow-200" },
  ];

  const testimonials = [
    { name: "Fatima Ahmed", location: "Karachi", text: "The best quality natural products I've found in Pakistan. My family loves the granola!", rating: 5 },
    { name: "Ahmad Khan", location: "Lahore", text: "Amazing quality and fast delivery. The halal certification gives me peace of mind.", rating: 5 },
    { name: "Sarah Malik", location: "Islamabad", text: "Finally, premium natural foods that meet international standards. Highly recommended!", rating: 5 },
  ];

  return (
    <>
      {/* ─── Hero Section ──────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/assets/images/story/about-hero.webp" alt="Bereket Foods premium natural foods" fill className="object-cover object-center" priority quality={90} sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a2e1c]/90 via-[#1a2e1c]/60 to-[#1a2e1c]/25" />
        </div>
        <div className="absolute top-20 right-10 w-80 h-80 bg-[var(--color-gold)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-20 w-56 h-56 bg-[var(--color-forest)]/10 rounded-full blur-2xl" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
              <div className="inline-flex items-center gap-2.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-8">
                <span className="w-2 h-2 bg-[var(--color-forest)] rounded-full animate-pulse" />
                <span className="text-sm text-white/90 font-medium tracking-wide">Premium Natural Foods · Est. 2022</span>
              </div>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '150ms', animationFillMode: 'forwards' }}>
              Nature&apos;s <span className="text-gradient">Finest</span><br />Goodness
            </h1>
            <p className="hero-paragraph text-lg sm:text-xl text-white/85 leading-relaxed mb-10 max-w-lg animate-fade-in-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
              Bringing prosperity to your table through the perfect amalgamation of nature and science. Premium natural foods — Halal certified, delivered across Pakistan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: '450ms', animationFillMode: 'forwards' }}>
              <Link href="/products" className="btn-primary inline-flex items-center justify-center gap-2 text-base group">
                Shop All Products <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/about" className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-base hover:bg-white hover:text-black transition-all duration-300">
                Our Story
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-6 animate-fade-in-up opacity-0" style={{ animationDelay: '550ms', animationFillMode: 'forwards' }}>
              <div className="flex items-center gap-2 text-white"><CheckCircle className="w-5 h-5 text-[var(--color-gold)] drop-shadow-sm" /><span className="text-base font-semibold drop-shadow-md">Halal Certified</span></div>
              <div className="flex items-center gap-2 text-white"><CheckCircle className="w-5 h-5 text-[var(--color-gold)] drop-shadow-sm" /><span className="text-base font-semibold drop-shadow-md">100% Natural</span></div>
              <div className="flex items-center gap-2 text-white"><CheckCircle className="w-5 h-5 text-[var(--color-gold)] drop-shadow-sm" /><span className="text-base font-semibold drop-shadow-md">Free Shipping</span></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/20">
              {stats.map((stat, i) => (
                <div key={stat.label} className="text-center px-3 sm:px-4 py-3 sm:py-0 animate-fade-in-up opacity-0 flex flex-col justify-center" style={{ animationDelay: `${650 + i * 100}ms`, animationFillMode: 'forwards' }}>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-white/80 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Brands Bar ─────────────────────────────────────── */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-[0.2em] mb-8">Trusted Brands</p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            {brands.map((brand, i) => (
              <span key={brand} className="text-lg sm:text-xl font-serif font-semibold text-gray-300 hover:text-[var(--color-gold)] transition-colors cursor-default">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories Section ─────────────────────────────── */}
      <section className="section-padding bg-[var(--color-cream)]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-3">Shop by Category</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-charcoal)]">Find Your Perfect Match</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => (
              <Link key={cat.name} href={`/products?category=${encodeURIComponent(cat.name)}`}
                className={`group flex flex-col items-center text-center p-6 rounded-2xl border-2 ${cat.border} bg-gradient-to-br ${cat.color} hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up opacity-0`}
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}>
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{cat.emoji}</span>
                <h3 className="text-sm font-bold text-[var(--color-charcoal)] leading-snug">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-snug">{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ──────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-3">Handpicked for You</p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-charcoal)]">Featured Products</h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[var(--color-gold)] hover:text-[#A68B4D] transition-colors group">
              View All Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {featuredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, i) => (
                <div key={product.id} className="animate-fade-in-up opacity-0" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}>
                  <ProductCard id={product.id} slug={product.slug} name={product.name} shortDescription={product.shortDescription} price={product.price} comparePrice={product.comparePrice} imageUrl={product.imageUrl} category={product.category} weight={product.weight} badge={product.badge} inStock={product.inStock} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[var(--color-cream)] rounded-3xl">
              <p className="text-gray-500 mb-4">No featured products yet.</p>
              <Link href="/products" className="text-[var(--color-gold)] font-semibold underline">View All Products</Link>
            </div>
          )}
          <div className="mt-10 text-center sm:hidden">
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-gold)] border-2 border-[var(--color-gold)] px-6 py-3 rounded-full hover:bg-[var(--color-gold)] hover:text-white transition-all">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Why Choose Us ──────────────────────────────────── */}
      <section className="section-padding bg-[var(--color-cream)]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-3">Our Promise</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-charcoal)]">Why Choose Bereket?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="group flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-gray-100 hover:border-[var(--color-gold)]/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up opacity-0" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}>
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-cream)] flex items-center justify-center text-[var(--color-gold)] mb-5 group-hover:bg-[var(--color-gold)] group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-[var(--color-charcoal)] mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ───────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-3">Customer Love</p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--color-charcoal)]">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-8 bg-[var(--color-cream)] rounded-2xl animate-fade-in-up opacity-0" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}>
                <div className="flex gap-1 mb-4">{[...Array(t.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-[var(--color-gold)] text-[var(--color-gold)]" />)}</div>
                <p className="text-gray-600 mb-6 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center text-[var(--color-gold)] font-semibold">{t.name[0]}</div>
                  <div><p className="font-semibold text-[var(--color-charcoal)]">{t.name}</p><p className="text-sm text-gray-400">{t.location}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Banner CTA ─────────────────────────────────────── */}
      <section className="py-20 bg-[var(--color-forest)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[var(--color-gold)]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-[var(--color-forest)]/10 rounded-full blur-2xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-sm font-semibold text-[var(--color-forest)] uppercase tracking-[0.2em] mb-4">Free Shipping Over Rs. 2,000</p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Start Your Natural Journey Today</h2>
          <p className="text-lg text-white/70 mb-8 max-w-lg mx-auto">Discover our premium range of natural foods and experience the difference quality makes.</p>
          <Link href="/products" className="inline-flex items-center justify-center gap-2 bg-[var(--color-gold)] text-white px-10 py-4 rounded-full font-semibold text-base hover:bg-[#A68B4D] transition-all hover:shadow-xl hover:scale-[1.02] group">
            Shop Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ─── Newsletter ─────────────────────────────────────── */}
      <section className="section-padding bg-[var(--color-cream)]">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-semibold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-3">Stay Updated</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--color-charcoal)] mb-4">Join Our Newsletter</h2>
            <p className="text-gray-500 mb-8">Get exclusive offers, new product updates, and healthy recipes delivered to your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Enter your email" className="input-field flex-1" required />
              <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
