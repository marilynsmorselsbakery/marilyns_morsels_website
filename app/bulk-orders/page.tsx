"use client";

import { useState } from "react";

export default function BulkOrdersPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const body = Object.fromEntries(formData.entries());

    const response = await fetch("/api/bulk-inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setStatus(response.ok ? "sent" : "error");
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2">Bulk & Corporate Orders</h1>
      <p className="text-sm text-morselBrown/80 mb-6">
        Need cookies for an office, client gifts, events, or subscription treats?
        Share a few details and we&apos;ll follow up with a custom quote.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-5 rounded-2xl shadow-sm border border-morselGold/10"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full border text-sm px-3 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs mb-1" htmlFor="company">
              Company (optional)
            </label>
            <input
              id="company"
              name="company"
              className="w-full border text-sm px-3 py-2 rounded-md"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              className="w-full border text-sm px-3 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs mb-1" htmlFor="phone">
              Phone (optional)
            </label>
            <input
              id="phone"
              name="phone"
              className="w-full border text-sm px-3 py-2 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs mb-1" htmlFor="details">
            Estimated quantity & date
          </label>
          <input
            id="details"
            name="details"
            required
            className="w-full border text-sm px-3 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block text-xs mb-1" htmlFor="notes">
            Notes & preferences
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="w-full border text-sm px-3 py-2 rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="px-5 py-2 text-sm rounded-full bg-morselBrown text-morselCream hover:bg-morselGold hover:text-morselBrown transition"
        >
          {status === "submitting" ? "Sending..." : "Submit Inquiry"}
        </button>

        {status === "sent" && (
          <p className="text-xs text-green-700 mt-1">
            Thank you. We&apos;ll be in touch shortly.
          </p>
        )}
        {status === "error" && (
          <p className="text-xs text-red-700 mt-1">Something went wrong. Please try again.</p>
        )}
      </form>
    </section>
  );
}

