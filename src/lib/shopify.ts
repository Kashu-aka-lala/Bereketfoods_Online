const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyFetch({ query, variables = {} }: { query: string; variables?: any }) {
  try {
    // Debugging logs to verify variables during the Vercel build phase
    console.log("Shopify Fetch Configured Domain:", domain);
    console.log("Token Available:", !!storefrontAccessToken);

    // Changed version from 2026-04 to 2024-07 for absolute stability
    const result = await fetch(`https://${domain}/api/2024-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken || '',
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 }
    });

    // Extract raw text first to avoid the JSON parsing crash
    const rawText = await result.text();

    if (!result.ok) {
      console.error(`Shopify HTTP Error Status: ${result.status}`);
      console.error(`Shopify Raw Error Response: ${rawText}`);
      return null;
    }

    return JSON.parse(rawText);
  } catch (error) {
    console.error("Shopify data fetch error:", error);
    return null;
  }
}

export async function getShopifyProducts() {
  const query = `
    query getProducts {
      products(first: 50) {
        edges {
          node {
            id
            handle
            title
            description
            productType
            vendor
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  price {
                    amount
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const response = await shopifyFetch({ query });
  return response?.data?.products?.edges || [];
}
