import Link from "next/link";

const policyLinks = [
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer className="border-t border-morselGold/10 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">

        {/* Row 1: Brand + NAP */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-base font-display font-semibold text-morselCocoa">
              Marilyn&apos;s Morsels Bakery
            </p>
            <p className="text-sm text-morselBrown/70 mt-1">
              Westerville, OH &nbsp;&middot;&nbsp;
              <a
                href="mailto:marilynsmorselsbakery@gmail.com"
                className="hover:text-morselGold transition-colors duration-150"
              >
                marilynsmorselsbakery@gmail.com
              </a>
            </p>
            <p className="text-xs text-morselBrown/50 mt-1">
              Baked with care in our licensed home kitchen.
            </p>
          </div>
        </div>

        {/* Row 2: Policy links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {policyLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm text-morselBrown/70 hover:text-morselGold transition-colors duration-150"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Row 3: Social placeholder + copyright */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-morselGold/10 pt-5">
          {/* Social placeholder — links to be added when client provides handles */}
          <div className="flex items-center gap-3 text-morselBrown/40 text-xs">
            <span>Follow us on social — coming soon</span>
          </div>
          <p className="text-xs text-morselBrown/50">
            &copy; {new Date().getFullYear()} Marilyn&apos;s Morsels Bakery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
