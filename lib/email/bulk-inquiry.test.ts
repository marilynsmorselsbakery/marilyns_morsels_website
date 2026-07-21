import { describe, expect, it } from "vitest";
import {
  parseBulkInquiryPayload,
  sendBulkInquiryEmail,
  type BulkInquiryEmailMessage,
} from "./bulk-inquiry";

describe("bulk inquiry email", () => {
  it("delivers the inquiry details to Marilyn with customer reply-to", async () => {
    const deliveries: Array<{
      message: BulkInquiryEmailMessage;
      idempotencyKey: string;
    }> = [];

    await sendBulkInquiryEmail(
      {
        id: "inquiry_123",
        submittedAt: "2026-07-21T16:30:00.000Z",
        name: "Jamie Customer",
        company: "Acme Events",
        email: "jamie@example.com",
        phone: "614-555-0123",
        details: "120 cookies for August 15",
        notes: "Chocolate chip and snickerdoodle",
      },
      async (message, options) => {
        deliveries.push({ message, idempotencyKey: options.idempotencyKey });
        return { id: "email_123" };
      },
      {
        from: "Marilyn's Morsels <orders@marilynsmorsels.com>",
        businessEmail: "marilynsmorselsbakery@gmail.com",
      }
    );

    expect(deliveries).toHaveLength(1);
    expect(deliveries[0]).toMatchObject({
      idempotencyKey: "bulk-inquiry/inquiry_123",
      message: {
        to: "marilynsmorselsbakery@gmail.com",
        replyTo: "jamie@example.com",
        subject: "NEW BULK INQUIRY — Jamie Customer — 120 cookies for August 15",
      },
    });
    expect(deliveries[0].message.text).toContain("Acme Events");
    expect(deliveries[0].message.text).toContain("614-555-0123");
    expect(deliveries[0].message.text).toContain(
      "Chocolate chip and snickerdoodle"
    );
  });

  it("normalizes a valid form submission", () => {
    expect(
      parseBulkInquiryPayload(
        {
          name: "  Jamie Customer  ",
          company: "  Acme Events ",
          email: " JAMIE@EXAMPLE.COM ",
          phone: " 614-555-0123 ",
          details: " 120 cookies for August 15 ",
          notes: " Chocolate chip ",
        },
        { id: "inquiry_123", submittedAt: "2026-07-21T16:30:00.000Z" }
      )
    ).toEqual({
      id: "inquiry_123",
      submittedAt: "2026-07-21T16:30:00.000Z",
      name: "Jamie Customer",
      company: "Acme Events",
      email: "jamie@example.com",
      phone: "614-555-0123",
      details: "120 cookies for August 15",
      notes: "Chocolate chip",
    });
  });

  it("rejects an incomplete or invalid form submission", () => {
    expect(
      parseBulkInquiryPayload(
        {
          name: "Jamie Customer",
          email: "not-an-email",
          details: "",
        },
        { id: "inquiry_123", submittedAt: "2026-07-21T16:30:00.000Z" }
      )
    ).toBeNull();
  });
});
