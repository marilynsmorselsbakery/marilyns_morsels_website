"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Database } from "@/lib/supabase/types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type FormState = {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
};

const emptyFormState: FormState = {
  full_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
};

const profileToFormState = (profile: Profile | null): FormState => ({
  ...emptyFormState,
  full_name: profile?.full_name ?? "",
  phone: profile?.phone ?? "",
  address_line1: profile?.address_line1 ?? "",
  address_line2: profile?.address_line2 ?? "",
  city: profile?.city ?? "",
  state: profile?.state ?? "",
  postal_code: profile?.postal_code ?? "",
});

type Props = {
  email: string;
  initialProfile: Profile | null;
};

export default function ProfileForm({ email, initialProfile }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<FormState>(() => profileToFormState(initialProfile));
  const [savedState, setSavedState] = useState<FormState>(() => profileToFormState(initialProfile));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (field: keyof FormState) => (value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleCancel = () => {
    setFormState(savedState);
    setIsEditing(false);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setErrorMessage(payload.error || "We couldn't save your profile. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const { profile } = (await response.json()) as { profile: Profile };
    const newState = profileToFormState(profile);
    setFormState(newState);
    setSavedState(newState);
    setSuccessMessage("Profile saved.");
    setIsSubmitting(false);
    setIsEditing(false);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-morselGold/30 bg-white/90 p-8 shadow-sm">
        <header className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Account details</h1>
            <p className="text-sm text-morselBrown/70">Signed in as {email}</p>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={handleEdit}
              className="rounded-md border border-morselGold/60 px-4 py-2 text-sm transition hover:border-morselGold hover:bg-morselGold/10"
            >
              Edit
            </button>
          )}
        </header>
        <form className="grid grid-cols-1 gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium">Full name</span>
            {isEditing ? (
              <input
                type="text"
                value={formState.full_name}
                onChange={(event) => handleChange("full_name")(event.target.value)}
                className="w-full rounded-md border border-morselGold/40 px-3 py-2 focus:border-morselGold focus:outline-none focus:ring"
              />
            ) : (
              <div className="rounded-md border border-transparent px-3 py-2 text-morselBrown/80">
                {formState.full_name || <span className="text-morselBrown/80">Not set</span>}
              </div>
            )}
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium">Phone</span>
            {isEditing ? (
              <input
                type="tel"
                value={formState.phone}
                onChange={(event) => handleChange("phone")(event.target.value)}
                className="w-full rounded-md border border-morselGold/40 px-3 py-2 focus:border-morselGold focus:outline-none focus:ring"
              />
            ) : (
              <div className="rounded-md border border-transparent px-3 py-2 text-morselBrown/80">
                {formState.phone || <span className="text-morselBrown/80">Not set</span>}
              </div>
            )}
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium">Address line 1</span>
            {isEditing ? (
              <input
                type="text"
                value={formState.address_line1}
                onChange={(event) => handleChange("address_line1")(event.target.value)}
                className="w-full rounded-md border border-morselGold/40 px-3 py-2 focus:border-morselGold focus:outline-none focus:ring"
              />
            ) : (
              <div className="rounded-md border border-transparent px-3 py-2 text-morselBrown/80">
                {formState.address_line1 || <span className="text-morselBrown/80">Not set</span>}
              </div>
            )}
          </label>
          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium">Address line 2</span>
            {isEditing ? (
              <input
                type="text"
                value={formState.address_line2}
                onChange={(event) => handleChange("address_line2")(event.target.value)}
                className="w-full rounded-md border border-morselGold/40 px-3 py-2 focus:border-morselGold focus:outline-none focus:ring"
              />
            ) : (
              <div className="rounded-md border border-transparent px-3 py-2 text-morselBrown/80">
                {formState.address_line2 || <span className="text-morselBrown/80">Not set</span>}
              </div>
            )}
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">City</span>
            {isEditing ? (
              <input
                type="text"
                value={formState.city}
                onChange={(event) => handleChange("city")(event.target.value)}
                className="w-full rounded-md border border-morselGold/40 px-3 py-2 focus:border-morselGold focus:outline-none focus:ring"
              />
            ) : (
              <div className="rounded-md border border-transparent px-3 py-2 text-morselBrown/80">
                {formState.city || <span className="text-morselBrown/80">Not set</span>}
              </div>
            )}
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">State</span>
            {isEditing ? (
              <input
                type="text"
                value={formState.state}
                onChange={(event) => handleChange("state")(event.target.value)}
                className="w-full rounded-md border border-morselGold/40 px-3 py-2 focus:border-morselGold focus:outline-none focus:ring"
              />
            ) : (
              <div className="rounded-md border border-transparent px-3 py-2 text-morselBrown/80">
                {formState.state || <span className="text-morselBrown/80">Not set</span>}
              </div>
            )}
          </label>
          <label className="text-sm md:col-span-2 md:max-w-xs">
            <span className="mb-1 block font-medium">Postal code</span>
            {isEditing ? (
              <input
                type="text"
                value={formState.postal_code}
                onChange={(event) => handleChange("postal_code")(event.target.value)}
                className="w-full rounded-md border border-morselGold/40 px-3 py-2 focus:border-morselGold focus:outline-none focus:ring"
              />
            ) : (
              <div className="rounded-md border border-transparent px-3 py-2 text-morselBrown/80">
                {formState.postal_code || <span className="text-morselBrown/80">Not set</span>}
              </div>
            )}
          </label>
          {errorMessage ? (
            <p className="md:col-span-2 text-sm text-red-600">{errorMessage}</p>
          ) : null}
          {successMessage ? (
            <p className="md:col-span-2 text-sm text-emerald-600">{successMessage}</p>
          ) : null}
          {isEditing && (
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-morselGold px-4 py-2 text-white transition hover:bg-morselGold/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="rounded-md border border-morselGold/60 px-4 py-2 transition hover:border-morselGold hover:bg-morselGold/10 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </section>
    </div>
  );
}

