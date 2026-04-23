"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6">🍪</div>
        <h2 className="text-2xl font-display font-semibold text-morselCocoa mb-3">
          Something went wrong
        </h2>
        <p className="text-morselBrown/70 mb-8">
          We hit a little snag — just like when a cookie sticks to the pan.
          Give it another try and we&apos;ll get you sorted.
        </p>
        <button
          onClick={reset}
          className="inline-block px-6 py-3 rounded-full bg-morselCocoa text-white font-semibold shadow-button hover:shadow-button-hover hover:scale-[1.02] transition-all duration-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
