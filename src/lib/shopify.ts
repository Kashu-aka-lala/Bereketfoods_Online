const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyFetch({ query, variables = {} }: { query: string; variables?: any }) {
  try {
    const result = await fetch(`https://${domain}/api/2026-04/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken!,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 } // Automatically update new changes from Shopify every 60 seconds
    });
    return await result.json();
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
