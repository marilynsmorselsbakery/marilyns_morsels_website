import { describe, expect, it, vi } from "vitest";
import type { OrderEmailMessage } from "./order";
import { createResendOrderEmailSender } from "./resend";

const message: OrderEmailMessage = {
  from: "Marilyn's Morsels <orders@marilynsmorsels.com>",
  to: "customer@example.com",
  replyTo: "marilynsmorselsbakery@gmail.com",
  subject: "Order received",
  html: "<p>Order received</p>",
  text: "Order received",
};

describe("Resend order email adapter", () => {
  it("passes the idempotency key to Resend", async () => {
    const send = vi.fn().mockResolvedValue({ data: { id: "email_123" }, error: null });
    const sender = createResendOrderEmailSender({ emails: { send } });

    await expect(
      sender(message, { idempotencyKey: "order-customer/cs_123" })
    ).resolves.toEqual({ id: "email_123" });
    expect(send).toHaveBeenCalledWith(message, {
      idempotencyKey: "order-customer/cs_123",
    });
  });

  it("throws so Stripe can retry when Resend rejects a message", async () => {
    const send = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "domain is not verified" },
    });
    const sender = createResendOrderEmailSender({ emails: { send } });

    await expect(
      sender(message, { idempotencyKey: "order-customer/cs_123" })
    ).rejects.toThrow("Order email delivery failed");
  });
});
