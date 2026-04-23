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

/**
 * Maps flavor slug → local image asset.
 *
 * One entry per flavor (not per SKU). When Marilyn provides real product photos,
 * update this one file.
 *
 * Flavor slugs:
 *   chocolate_chip, butterscotch_chip, half_half, pbcup_sugar_cookie
 *   chocolate_chip_dough, butterscotch_chip_dough, pbcup_sugar_cookie_dough
 *
 * Photo provenance: real photos live at assets/*.jpg. Half & Half has no real
 * photo yet (placeholder). Full candidate set in assets/new-cookie/.
 */
const PRODUCT_IMAGES: Record<string, StaticImageData> = {
  // Cookies — baked hero shots
  chocolate_chip: ccBaked,
  butterscotch_chip: cowboyBaked,
  half_half: sixCookie,         // placeholder — no real Half & Half photo yet
  pbcup_sugar_cookie: pbcupBaked,

  // Dough
  chocolate_chip_dough: ccDough,
  butterscotch_chip_dough: cowboyDough,
  pbcup_sugar_cookie_dough: pbcupDough,
};

const FALLBACK_IMAGE: StaticImageData = chipsBowl;

export function getProductImage(flavorId: string): StaticImageData {
  return PRODUCT_IMAGES[flavorId] ?? FALLBACK_IMAGE;
}
