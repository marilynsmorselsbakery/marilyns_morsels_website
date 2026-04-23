import { MetadataRoute } from "next";

const BASE_URL = "https://marilynsmorsels.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all crawlers by default
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/checkout", "/account", "/success", "/cancel"],
      },
      // Explicit allow for AI crawlers (GEO / LLM discoverability)
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/", "/checkout", "/account", "/success", "/cancel"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/api/", "/checkout", "/account", "/success", "/cancel"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/", "/checkout", "/account", "/success", "/cancel"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/", "/checkout", "/account", "/success", "/cancel"],
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: ["/api/", "/checkout", "/account", "/success", "/cancel"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
