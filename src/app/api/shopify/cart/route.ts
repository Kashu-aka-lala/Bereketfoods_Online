import { NextRequest, NextResponse } from "next/server";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyMutation(query: string, variables: object) {
  const res = await fetch(`https://${domain}/api/2024-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token || "",
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store", // mutations must NEVER be cached
  });

  const text = await res.text();
  if (!res.ok) {
    console.error("[shopify/cart] HTTP error:", res.status, text);
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    console.error("[shopify/cart] JSON parse error:", text);
    return null;
  }
}

const CART_CREATE = `
  mutation cartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_ADD = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, cartId, lines } = body;

    if (action === "create") {
      const data = await shopifyMutation(CART_CREATE, { input: { lines } });
      console.log("[shopify/cart] cartCreate response:", JSON.stringify(data));

      const cart = data?.data?.cartCreate?.cart;
      const userErrors = data?.data?.cartCreate?.userErrors;

      if (userErrors?.length) {
        return NextResponse.json(
          { error: userErrors[0].message },
          { status: 422 }
        );
      }
      if (!cart?.checkoutUrl) {
        return NextResponse.json(
          { error: "No checkoutUrl returned from Shopify" },
          { status: 500 }
        );
      }
      return NextResponse.json({ cart });
    }

    if (action === "addLines") {
      const data = await shopifyMutation(CART_LINES_ADD, { cartId, lines });
      const cart = data?.data?.cartLinesAdd?.cart;
      const userErrors = data?.data?.cartLinesAdd?.userErrors;

      if (userErrors?.length) {
        return NextResponse.json(
          { error: userErrors[0].message },
          { status: 422 }
        );
      }
      return NextResponse.json({ cart });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("[shopify/cart] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
