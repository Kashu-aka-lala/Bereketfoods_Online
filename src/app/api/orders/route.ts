import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BN-${timestamp}-${random}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      address,
      city,
      postalCode,
      items,
      subtotal,
      shippingFee = 0,
      total,
      paymentMethod,
      notes,
    } = body;

    if (!customerName || !customerPhone || !address || !city || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        customerName,
        customerPhone,
        customerEmail: customerEmail || null,
        address,
        city,
        postalCode: postalCode || null,
        items,
        subtotal: subtotal.toString(),
        shippingFee: shippingFee.toString(),
        total: total.toString(),
        paymentMethod,
        paymentStatus: paymentMethod === "cod" ? "pending" : "initiated",
        orderStatus: "processing",
        notes: notes || null,
      })
      .returning();

    return NextResponse.json({ order, orderNumber }, { status: 201 });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const allOrders = await db
      .select()
      .from(orders)
      .orderBy(desc(orders.createdAt));
    return NextResponse.json({ orders: allOrders });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
