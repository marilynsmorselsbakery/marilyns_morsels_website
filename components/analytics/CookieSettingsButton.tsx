"use client";

import { OPEN_CONSENT_EVENT } from "./AnalyticsConsent";

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className="text-sm text-morselBrown/70 transition-colors duration-150 hover:text-morselGold"
    >
      Cookie settings
    </button>
  );
}
