import "@/styles/globals.css";
import { ReactNode } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SupabaseSessionProvider from "@/components/SupabaseSessionProvider";
import { CartProvider } from "@/components/CartProvider";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// next/font: self-hosted, font-display: swap, zero layout shift
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Marilyn's Morsels Bakery — Fresh-Baked Cookies from Westerville, OH",
    template: "%s | Marilyn's Morsels Bakery",
  },
  description:
    "Small-batch cookies and cookie dough baked fresh in Marilyn's home kitchen in Westerville, Ohio. Order online for local delivery or nationwide shipping.",
  metadataBase: new URL("https://marilynsmorsels.com"),
  openGraph: {
    siteName: "Marilyn's Morsels Bakery",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Supabase session refresh is handled by middleware.ts; no await needed here.
  // Keeping the layout synchronous avoids creating a streaming boundary that
  // was preventing React 19 from auto-hoisting <title>/<meta> tags to <head>.
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-morselCream text-morselBrown font-body">
        <SupabaseSessionProvider initialSession={null}>
          <CartProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#ffffff",          // white
                  color: "#3F2A1C",               // morselBrown
                  border: "1px solid #D79B4E",    // morselGold
                  borderRadius: "8px",
                },
                success: {
                  iconTheme: {
                    primary: "#D79B4E",   // morselGold
                    secondary: "#ffffff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#dc2626",   // red-600
                    secondary: "#ffffff",
                  },
                },
              }}
            />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Analytics />
            <SpeedInsights />
          </CartProvider>
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
