"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logoSquare from "@/assets/clear-logo-square.png";
import { useSupabaseClient, useSupabaseSession } from "@/components/SupabaseSessionProvider";
import { useCart } from "@/components/CartProvider";
import CartDrawer from "@/components/CartDrawer";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const session = useSupabaseSession();
  const supabase = useSupabaseClient();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await supabase.auth.signOut();
      router.refresh();
      router.push("/");
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleCheckout = async () => {
    setIsCartOpen(false);
    if (!session) {
      router.push("/login?redirectTo=/shop");
      return;
    }
    router.push("/checkout");
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-200 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md border-morselGold/30 shadow-sm"
            : "bg-white/80 backdrop-blur border-morselGold/20"
        }`}
      >
        <nav className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <Image
              src={logoSquare}
              alt="Marilyn's Morsels"
              width={64}
              height={64}
              className="h-12 w-12 md:h-16 md:w-16"
              priority
            />
            <span className="text-2xl md:text-3xl font-display font-semibold tracking-tight">
              Marilyn&apos;s <span className="text-morselGold">Morsels</span>
            </span>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/shop" className="hover:text-morselGold transition-colors duration-150">
              Shop
            </Link>
            <Link href="/about" className="hover:text-morselGold transition-colors duration-150">
              About
            </Link>
            <Link href="/bulk-orders" className="hover:text-morselGold transition-colors duration-150">
              Bulk Orders
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative hover:text-morselGold transition-colors duration-150"
              aria-label="Open cart"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-morselGold text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>
            {session ? (
              <>
                <Link href="/account" className="hover:text-morselGold transition-colors duration-150">
                  Account
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="rounded-md border border-morselGold/60 px-3 py-1 transition hover:border-morselGold hover:bg-morselGold/10 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSigningOut ? "Signing out..." : "Sign out"}
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-morselGold transition-colors duration-150">
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-md bg-morselGold px-3 py-1 text-white transition hover:bg-morselGold/90"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:text-morselGold transition-colors duration-150"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </nav>
      </header>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-morselGold/20">
            <span className="text-lg font-display font-semibold text-morselBrown">
              Menu
            </span>
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:text-morselGold transition-colors duration-150"
              aria-label="Close mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Content */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/shop"
                onClick={closeMobileMenu}
                className="text-base text-morselBrown hover:text-morselGold transition-colors duration-150 py-2 border-b border-morselGold/10"
              >
                Shop
              </Link>
              <Link
                href="/about"
                onClick={closeMobileMenu}
                className="text-base text-morselBrown hover:text-morselGold transition-colors duration-150 py-2 border-b border-morselGold/10"
              >
                About
              </Link>
              <Link
                href="/bulk-orders"
                onClick={closeMobileMenu}
                className="text-base text-morselBrown hover:text-morselGold transition-colors duration-150 py-2 border-b border-morselGold/10"
              >
                Bulk Orders
              </Link>
              <button
                onClick={() => {
                  setIsCartOpen(true);
                  closeMobileMenu();
                }}
                className="relative flex items-center gap-2 text-base text-morselBrown hover:text-morselGold transition-colors duration-150 py-2 border-b border-morselGold/10"
                aria-label="Open cart"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Cart
                {itemCount > 0 && (
                  <span className="bg-morselGold text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
              {session ? (
                <>
                  <Link
                    href="/account"
                    onClick={closeMobileMenu}
                    className="text-base text-morselBrown hover:text-morselGold transition-colors duration-150 py-2 border-b border-morselGold/10"
                  >
                    Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleSignOut();
                      closeMobileMenu();
                    }}
                    disabled={isSigningOut}
                    className="text-left rounded-md border border-morselGold/60 px-4 py-2 text-base transition hover:border-morselGold hover:bg-morselGold/10 disabled:cursor-not-allowed disabled:opacity-70 mt-2"
                  >
                    {isSigningOut ? "Signing out..." : "Sign out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="text-base text-morselBrown hover:text-morselGold transition-colors duration-150 py-2 border-b border-morselGold/10"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    onClick={closeMobileMenu}
                    className="rounded-md bg-morselGold px-4 py-2 text-white text-base transition hover:bg-morselGold/90 text-center mt-2"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />
    </>
  );
}
