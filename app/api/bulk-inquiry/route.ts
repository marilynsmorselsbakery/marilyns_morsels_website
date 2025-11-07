import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // TODO: Integrate with email provider such as Resend, Formspree, or Mailgun.
    console.log("Bulk inquiry:", data);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Bulk inquiry error", error);
    return NextResponse.json({ error: "Unable to send" }, { status: 500 });
  }
}

