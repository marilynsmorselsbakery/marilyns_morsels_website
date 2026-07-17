"use client";

import { useEffect, useState } from "react";
import {
  getConsentChoice,
  setConsentChoice,
  type ConsentChoice,
} from "@/lib/analytics/consent";

export const OPEN_CONSENT_EVENT = "mm-open-analytics-consent";

export default function AnalyticsConsent() {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);

  useEffect(() => {
    const storedChoice = getConsentChoice();
    if (storedChoice !== "unset") {
      setConsentChoice(storedChoice);
    }

    const initializationTimer = window.setTimeout(() => {
      setChoice(storedChoice);
    }, 0);

    const openSettings = () => setChoice("unset");
    window.addEventListener(OPEN_CONSENT_EVENT, openSettings);
    return () => {
      window.clearTimeout(initializationTimer);
      window.removeEventListener(OPEN_CONSENT_EVENT, openSettings);
    };
  }, []);

  if (choice !== "unset") return null;

  const choose = (nextChoice: "granted" | "denied") => {
    setConsentChoice(nextChoice);
    setChoice(nextChoice);
  };

  return (
    <aside
      aria-label="Analytics privacy choices"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-morselGold/30 bg-white p-5 shadow-2xl"
    >
      <h2 className="font-display text-lg font-semibold text-morselCocoa">
        Help us improve Marilyn&apos;s Morsels
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-morselBrown/80">
        With your permission, we use Google Analytics and Microsoft Clarity to understand which
        pages and shopping steps work well. We do not send your name, contact details, address, or
        payment information to these tools.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => choose("denied")}
          className="rounded-full border border-morselCocoa/30 px-5 py-2.5 text-sm font-semibold text-morselCocoa transition hover:bg-morselCream"
        >
          Decline analytics
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className="rounded-full bg-morselCocoa px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-morselBrown"
        >
          Accept analytics
        </button>
      </div>
    </aside>
  );
}
