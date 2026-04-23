import type { Product } from "@/lib/products";

interface ProductSchemaProps {
  products: Product[];
}

/**
 * Emits one Product JSON-LD per flavor, with an offers[] array per variant.
 * Used in server components (app/shop/page.tsx) — not client-rendered.
 * Schema spec: https://schema.org/Product
 */
export default function ProductSchema({ products }: ProductSchemaProps) {
  const schemas = products.map((product) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category === "cookie" ? "Cookies" : "Cookie Dough",
    brand: {
      "@type": "Brand",
      name: "Marilyn's Morsels Bakery",
    },
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      name: v.packLabel,
      priceCurrency: "USD",
      price: (v.priceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      url: "https://marilynsmorsels.com/shop",
      seller: {
        "@type": "Organization",
        name: "Marilyn's Morsels Bakery",
      },
    })),
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  );
}
