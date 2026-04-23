export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div
          className="w-12 h-12 rounded-full border-4 border-morselGold/20 border-t-morselGold animate-spin"
          aria-label="Loading"
          role="status"
        />
        <p className="text-sm text-morselBrown/60">Loading…</p>
      </div>
    </div>
  );
}
