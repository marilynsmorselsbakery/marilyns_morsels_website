"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logoSquare from "@/assets/clear-logo-square.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-morselGold/30 shadow-sm"
          : "bg-white/80 backdrop-blur border-morselGold/20"
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={logoSquare}
            alt="Marilyn's Morsels"
            width={40}
            height={40}
            className="h-8 w-8 md:h-10 md:w-10"
            priority
          />
          <span className="text-xl font-display font-semibold tracking-tight">
            Marilyn&apos;s <span className="text-morselGold">Morsels</span>
          </span>
        </Link>
        <div className="flex gap-6 text-sm">
          <Link href="/shop" className="hover:text-morselGold transition-colors duration-150">
            Shop
          </Link>
          <Link href="/about" className="hover:text-morselGold transition-colors duration-150">
            About
          </Link>
          <Link href="/bulk-orders" className="hover:text-morselGold transition-colors duration-150">
            Bulk Orders
          </Link>
        </div>
      </nav>
    </header>
  );
}
