import { redirect } from "next/navigation";
import ProfileForm from "@/components/account/ProfileForm";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

export default async function AccountPage() {
  const supabase = createSupabaseServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/account");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<Database["public"]["Tables"]["profiles"]["Row"]>();

  if (error && error.code !== "PGRST116") {
    console.error("Failed to load profile", error);
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-28 pb-16 md:pt-32 md:pb-20">
      <ProfileForm email={user.email ?? ""} initialProfile={profile ?? null} />
      
      <section className="mt-6 rounded-lg border border-morselGold/30 bg-white/90 p-8 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Payment methods</h2>
        <p className="text-sm text-morselBrown/70">
          Payment methods are managed securely through Stripe. After your first purchase, you&apos;ll be able to save and manage your payment methods here.
        </p>
        {profile?.stripe_customer_id ? (
          <p className="mt-3 text-sm text-morselBrown/60">
            Your payment information is securely stored with Stripe. You can add or update payment methods during checkout.
          </p>
        ) : (
          <p className="mt-3 text-sm text-morselBrown/60">
            Complete your first purchase to enable saved payment methods.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-lg border border-morselGold/30 bg-white/90 p-8 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Order history</h2>
        <p className="text-sm text-morselBrown/70">
          Your past orders will appear here once order tracking is set up. This feature is coming soon!
        </p>
      </section>
    </div>
  );
}

