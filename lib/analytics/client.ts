import type { AnalyticsEvent } from "./types";

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as Window & { dataLayer?: unknown[] };
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  if ("ecommerce" in event) {
    analyticsWindow.dataLayer.push({ ecommerce: null });
  }
  analyticsWindow.dataLayer.push(event);
}
