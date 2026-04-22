import type { ProductCategory } from "./products";

export const FLAVOR_LABELS: Record<string, string> = {
  chocolate_chip: "Chocolate Chip",
  butterscotch_chip: "Butterscotch Chocolate Chip",
  half_half: "Half & Half",
  pbcup_sugar_cookie: "Peanut Butter Cup Sugar Cookie",
  chocolate_chip_dough: "Chocolate Chip Cookie Dough",
  butterscotch_chip_dough: "Butterscotch Chocolate Chip Cookie Dough",
  pbcup_sugar_cookie_dough: "Peanut Butter Cup Sugar Cookie Dough",
};

export const FLAVOR_SUBTITLES: Record<string, string> = {
  chocolate_chip: "Classic, buttery chocolate chip morsels baked to perfection.",
  butterscotch_chip: "Rich butterscotch & chocolate with caramelized edges.",
  half_half:
    "The best of both worlds - a mix of chocolate chip and butterscotch chocolate chip.",
  pbcup_sugar_cookie: "Sugar cookies baked around a peanut butter cup.",
  chocolate_chip_dough: "Ready-to-bake chocolate chip cookie dough.",
  butterscotch_chip_dough:
    "Ready-to-bake butterscotch chocolate chip cookie dough.",
  pbcup_sugar_cookie_dough:
    "Ready-to-bake peanut butter cup sugar cookie dough.",
};

export function getFlavorLabel(flavor: string): string {
  return FLAVOR_LABELS[flavor] ?? flavor;
}

export function getFlavorSubtitle(flavor: string): string {
  return FLAVOR_SUBTITLES[flavor] ?? "";
}

export function getPackSizeDisplay(
  packSize: string,
  category: ProductCategory
): { label: string; value: string } {
  if (category === "dough") {
    const formatted = packSize.charAt(0).toUpperCase() + packSize.slice(1);
    return { label: "Size", value: formatted };
  }
  return { label: "Pack Size", value: `${packSize} Cookies` };
}
