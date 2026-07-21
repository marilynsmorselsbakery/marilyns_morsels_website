import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  parseBulkInquiryPayload,
  sendBulkInquiryEmail,
} from "../../../lib/email/bulk-inquiry";

export const runtime = "nodejs";

const resendApiKey = process.env.RESEND_API_KEY;
const inquiryEmailFrom =
  process.env.ORDER_EMAIL_FROM ??
  "Marilyn's Morsels <orders@marilynsmorsels.com>";
const inquiryNotificationTo =
  process.env.ORDER_NOTIFICATION_TO ?? "marilynsmorselsbakery@gmail.com";
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: NextRequest) {
  if (!resend) {
    console.error("Bulk inquiry email configuration is missing");
    return NextResponse.json({ error: "Email is not configured" }, { status: 503 });
  }

  try {
    const payload = await request.json();
    const inquiry = parseBulkInquiryPayload(payload, {
      id: randomUUID(),
      submittedAt: new Date().toISOString(),
    });

    if (!inquiry) {
      return NextResponse.json({ error: "Invalid inquiry" }, { status: 400 });
    }

    await sendBulkInquiryEmail(
      inquiry,
      async (message, options) => {
        const { data, error } = await resend.emails.send(message, options);
        if (error || !data) {
          throw new Error(
            `Bulk inquiry email delivery failed: ${error?.message ?? "unknown error"}`
          );
        }

        return { id: data.id };
      },
      {
        from: inquiryEmailFrom,
        businessEmail: inquiryNotificationTo,
      }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Bulk inquiry error", error);
    return NextResponse.json({ error: "Unable to send" }, { status: 500 });
  }
}
