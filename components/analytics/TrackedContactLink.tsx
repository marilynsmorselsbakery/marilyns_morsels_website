"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics/client";

type Props = {
  href: string;
  method: "email" | "phone";
  className?: string;
  children: ReactNode;
};

export default function TrackedContactLink({ href, method, className, children }: Props) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => track({ event: "contact_click", contact_method: method })}
    >
      {children}
    </a>
  );
}
