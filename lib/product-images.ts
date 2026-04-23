import type { StaticImageData } from "next/image";
// Real product photos (2026-04-23 — converted from iOS HEIC by MBC, mapped by Claude)
import ccBaked from "@/assets/chocolate-chip-baked.jpg";
import ccDough from "@/assets/chocolate-chip-dough.jpg";
import cowboyBaked from "@/assets/cowboy-baked.jpg";
import cowboyDough from "@/assets/cowboy-dough.jpg";
import pbcupBaked from "@/assets/pbcup-baked.jpg";
import pbcupDough from "@/assets/pbcup-dough.jpg";
// Legacy placeholders — kept for Half & Half (no real photo yet) + FALLBACK
import chipsBowl from "@/assets/chips_bowl.png";
import sixCookie from "@/assets/six_cookie.png";
import freshDozen from "@/assets/fresh_dozen.png";

/**
 * Maps Stripe product metadata.slug → local image asset.
 *
 * When Marilyn provides real product photos, update this one file.
 * New slugs without an entry fall back to FALLBACK_IMAGE via getProductImage().
 *
 * Current slugs in Stripe:
 *   cc-6, cc-12                                   (Old Fashion Chocolate Chip)
 *   bc-6, bc-12                                   (rebranded "Cowboy Cookie" per Rick's 2026-04 notes)
 *   hh-6, hh-12                                   (Half & Half — may be renamed to "The Sequel"; awaiting Rick confirm)
 *   pbcup-6, pbcup-12                             (Peanut Butter Cup Sugar Cookies)
 *   cc-dough-pint, cc-dough-quart                 (Chocolate Chip dough)
 *   bc-dough-pint, bc-dough-quart                 (Cowboy Cookie dough)
 *   pbcup-dough-pint, pbcup-dough-quart           (PB Cup Sugar Cookie dough)
 *
 * Photo provenance: real photos live at assets/*.jpg (chocolate-chip-baked, cowboy-baked,
 * pbcup-baked, and the -dough counterparts). Full set of 10 candidate photos still in
 * assets/new-cookie/ for reference. Half & Half has no real photo yet (placeholder).
 * Plush Trio + The Sequel also have no real photos.
 */
const PRODUCT_IMAGES: Record<string, StaticImageData> = {
  // Cookies — baked hero shots
  "cc-6": ccBaked,
  "cc-12": ccBaked,
  "bc-6": cowboyBaked,
  "bc-12": cowboyBaked,
  "hh-6": sixCookie, // placeholder — no real Half & Half / Sequel photo yet
  "hh-12": freshDozen, // placeholder
  "pbcup-6": pbcupBaked,
  "pbcup-12": pbcupBaked,

  // Dough
  "cc-dough-pint": ccDough,
  "cc-dough-quart": ccDough,
  "bc-dough-pint": cowboyDough,
  "bc-dough-quart": cowboyDough,
  "pbcup-dough-pint": pbcupDough,
  "pbcup-dough-quart": pbcupDough,
};

const FALLBACK_IMAGE: StaticImageData = chipsBowl;

export function getProductImage(slug: string): StaticImageData {
  return PRODUCT_IMAGES[slug] ?? FALLBACK_IMAGE;
}
