import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PRODUCTS_SEED } from "@/lib/products-data-new";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const allProducts = await db.select().from(products).orderBy(products.id);
    return NextResponse.json({ products: allProducts });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Seed products if none exist
    const existing = await db.select().from(products);
    if (existing.length > 0) {
      return NextResponse.json({
        message: "Products already seeded",
        count: existing.length,
      });
    }

    for (const product of PRODUCTS_SEED) {
      await db.insert(products).values({
        slug: product.slug,
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice ?? null,
        imageUrl: product.imageUrl,
        images: product.images,
        category: product.category,
        brand: product.brand,
        weight: product.weight,
        inStock: product.inStock,
        featured: product.featured,
        badge: product.badge,
        ingredients: product.ingredients,
        benefits: product.benefits,
        nutritionalFacts: product.nutritionalFacts,
        certifications: product.certifications,
      });
    }

    return NextResponse.json({ message: "Products seeded", count: PRODUCTS_SEED.length });
  } catch (err) {
    console.error("Seed error:", err);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const deleteAll = searchParams.get("deleteAll");
    
    if (deleteAll === "true") {
      await db.delete(products);
      return NextResponse.json({ message: "All products deleted" });
    }
    
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await db.delete(products).where(eq(products.id, Number(id)));
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
