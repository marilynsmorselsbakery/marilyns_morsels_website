import type { StaticImageData } from "next/image";
import chipsBowl from "@/assets/chips_bowl.png";
import sixCookie from "@/assets/six_cookie.png";
import freshDozen from "@/assets/fresh_dozen.png";
import milkStack from "@/assets/milk_stack.png";
import plateStack from "@/assets/plate_stack.png";
import cookieStackLean from "@/assets/cookie-stack-lean.jpg";

/**
 * Maps Stripe product metadata.slug → local image asset.
 *
 * When Marilyn provides real product photos, update this one file.
 * New slugs without an entry fall back to FALLBACK_IMAGE via getProductImage().
 *
 * Current slugs in Stripe:
 *   cc-6, cc-12, bc-6, bc-12, hh-6, hh-12          (cookies — have images)
 *   cc-dough-pint, cc-dough-quart                  (dough — placeholder)
 *   bc-dough-pint, bc-dough-quart                  (dough — placeholder)
 *   pbcup-6, pbcup-12                              (cookies — placeholder)
 *   pbcup-dough-pint, pbcup-dough-quart            (dough — placeholder)
 */
const PRODUCT_IMAGES: Record<string, StaticImageData> = {
  "cc-6": plateStack,
  "cc-12": cookieStackLean,
  "bc-6": milkStack,
  "bc-12": chipsBowl,
  "hh-6": sixCookie,
  "hh-12": freshDozen,
};

const FALLBACK_IMAGE: StaticImageData = chipsBowl;

export function getProductImage(slug: string): StaticImageData {
  return PRODUCT_IMAGES[slug] ?? FALLBACK_IMAGE;
}
