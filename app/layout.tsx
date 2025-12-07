import "@/styles/globals.css";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SupabaseSessionProvider from "@/components/SupabaseSessionProvider";
import { CartProvider } from "@/components/CartProvider";
import { Toaster } from "react-hot-toast";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Marilyn's Morsels",
  description: "Small-batch cookies baked fresh from Marilyn's home kitchen.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Use getUser() for secure authentication check (getSession() is insecure)
  // We'll pass null as initialSession and let client-side onAuthStateChange handle the session
  const supabase = await createSupabaseServerComponentClient();
  await supabase.auth.getUser(); // Verify auth but don't use the result for session

  return (
    <html lang="en">
      <body className="bg-morselCream text-morselBrown font-body">
        <SupabaseSessionProvider initialSession={null}>
          <CartProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#fff",
                  color: "#5C3D2E",
                  border: "1px solid #D09B45",
                  borderRadius: "8px",
                },
                success: {
                  iconTheme: {
                    primary: "#D09B45",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#dc2626",
                    secondary: "#fff",
                  },
                },
              }}
            />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </CartProvider>
        </SupabaseSessionProvider>
      </body>
    </html>
  );
}
