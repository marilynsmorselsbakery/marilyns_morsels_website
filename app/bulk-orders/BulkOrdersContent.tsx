"use client";

import Image from "next/image";
import { useState } from "react";
import { useParallax } from "@/hooks/useParallax";
import milkStack from "@/assets/milk_stack.png";
import plateStack from "@/assets/plate_stack.png";

export default function BulkOrdersContent() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  const offsetTop = useParallax({ speed: 0.2, offset: -40 });
  const offsetBottom = useParallax({ speed: 0.1, offset: 60 });

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
    <section className="relative max-w-4xl mx-auto px-4 py-14 md:py-20 mt-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-16 -left-20 w-80 h-80 opacity-15 blur-sm">
          <div
            className="relative w-full h-full"
            style={{ transform: `translateY(${offsetTop}px)` }}
          >
            <Image src={milkStack} alt="" fill className="object-contain" aria-hidden="true" />
          </div>
        </div>
        <div className="absolute bottom-[-6rem] -right-24 w-96 h-96 opacity-20 blur-sm">
          <div
            className="relative w-full h-full"
            style={{ transform: `translateY(${offsetBottom}px)` }}
          >
            <Image src={plateStack} alt="" fill className="object-contain" aria-hidden="true" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
      </div>

      <div className="relative z-10">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-morselCocoa mb-4">
          Bulk & Corporate Orders
        </h1>
        <p className="text-base text-morselBrown/80 mb-8 leading-relaxed">
          Need cookies for an office, client gifts, events, or subscription treats? Share a few
          details and we&apos;ll follow up with a custom quote tailored to your occasion.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl shadow-morselGold/10 border border-morselGold/20"
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
            className="px-6 py-3 text-base font-semibold rounded-full bg-morselCocoa text-white shadow-button hover:shadow-button-hover hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </div>
    </section>
  );
}

