import { afterEach, describe, expect, it, vi } from "vitest";
import {
  consentSettings,
  getAnalyticsContext,
  parseConsentChoice,
  setConsentChoice,
} from "./consent";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe("analytics consent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("accepts only the two persisted consent values", () => {
    expect(parseConsentChoice("granted")).toBe("granted");
    expect(parseConsentChoice("denied")).toBe("denied");
    expect(parseConsentChoice("yes")).toBe("unset");
    expect(parseConsentChoice(null)).toBe("unset");
  });

  it("never grants advertising storage", () => {
    expect(consentSettings("granted")).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    expect(consentSettings("denied").analytics_storage).toBe("denied");
    expect(consentSettings("unset").analytics_storage).toBe("denied");
  });

  it("returns no checkout context without explicit consent", () => {
    const localStorage = memoryStorage();
    localStorage.setItem("mm_analytics_consent", "denied");
    vi.stubGlobal("window", { localStorage });

    expect(getAnalyticsContext()).toBeNull();
  });

  it("pushes consent updates in the gtag command format", () => {
    const localStorage = memoryStorage();
    const dataLayer: unknown[] = [];
    vi.stubGlobal("window", { localStorage, dataLayer });

    setConsentChoice("granted");

    expect(Object.prototype.toString.call(dataLayer[0])).toBe("[object Arguments]");
    expect(Array.from(dataLayer[0] as IArguments)).toEqual([
      "consent",
      "update",
      consentSettings("granted"),
    ]);
    expect(dataLayer[1]).toEqual({
      event: "analytics_consent_updated",
      consent: "granted",
    });
  });

  it("creates and reuses a pseudonymous client id after consent", () => {
    const localStorage = memoryStorage();
    localStorage.setItem("mm_analytics_consent", "granted");
    vi.stubGlobal("window", { localStorage });
    vi.stubGlobal("crypto", { randomUUID: () => "client-123" });

    expect(getAnalyticsContext()).toEqual({ consent: true, clientId: "client-123" });
    expect(getAnalyticsContext()).toEqual({ consent: true, clientId: "client-123" });
  });
});
