export default function Footer() {
  return (
    <footer className="border-t border-morselGold/10 bg-white">
      <div className="max-w-6xl mx-auto py-6 px-4 text-xs flex flex-col sm:flex-row justify-between gap-2">
        <div>© {new Date().getFullYear()} Marilyn&apos;s Morsels. All rights reserved.</div>
        <div className="text-morselBrown/70">
          Baked with care in our licensed home kitchen.
        </div>
      </div>
    </footer>
  );
}

