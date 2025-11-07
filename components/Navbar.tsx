import Link from "next/link";

export default function Navbar() {
  return (
    <header className="w-full border-b border-morselGold/20 bg-white/80 backdrop-blur">
      <nav className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Marilyn&apos;s <span className="text-morselGold">Morsels</span>
        </Link>
        <div className="flex gap-6 text-sm">
          <Link href="/shop" className="hover:text-morselGold">
            Shop
          </Link>
          <Link href="/about" className="hover:text-morselGold">
            About
          </Link>
          <Link href="/bulk-orders" className="hover:text-morselGold">
            Bulk Orders
          </Link>
        </div>
      </nav>
    </header>
  );
}

