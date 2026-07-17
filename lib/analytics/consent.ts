import type { AnalyticsCheckoutContext } from "./types";

export type ConsentChoice = "granted" | "denied" | "unset";
export const CONSENT_STORAGE_KEY = "mm_analytics_consent";
const CLIENT_ID_STORAGE_KEY = "mm_analytics_client_id";

export function parseConsentChoice(value: unknown): ConsentChoice {
  return value === "granted" || value === "denied" ? value : "unset";
}

export function consentSettings(choice: ConsentChoice) {
  return {
    analytics_storage: choice === "granted" ? "granted" : "denied",
    ad_storage: "denied" as const,
    ad_user_data: "denied" as const,
    ad_personalization: "denied" as const,
  };
}

export function getConsentChoice(): ConsentChoice {
  if (typeof window === "undefined") return "unset";
  try {
    return parseConsentChoice(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return "unset";
  }
}

function pushConsentUpdate(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  const analyticsWindow = window as Window & { dataLayer?: unknown[] };
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push(["consent", "update", consentSettings(choice)]);
  analyticsWindow.dataLayer.push({ event: "analytics_consent_updated", consent: choice });
}

export function setConsentChoice(choice: Exclude<ConsentChoice, "unset">): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Consent still applies to this page even when storage is unavailable.
  }
  pushConsentUpdate(choice);
}

export function hasAnalyticsConsent(): boolean {
  return getConsentChoice() === "granted";
}

export function getAnalyticsContext(): AnalyticsCheckoutContext | null {
  if (!hasAnalyticsConsent() || typeof window === "undefined") return null;

  try {
    let clientId = window.localStorage.getItem(CLIENT_ID_STORAGE_KEY);
    if (!clientId) {
      clientId = crypto.randomUUID();
      window.localStorage.setItem(CLIENT_ID_STORAGE_KEY, clientId);
    }
    return { consent: true, clientId };
  } catch {
    return null;
  }
}
