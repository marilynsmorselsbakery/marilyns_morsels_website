import type { OrderEmailMessage, OrderEmailSender } from "./order";

type ResendLike = {
  emails: {
    send: (
      message: OrderEmailMessage,
      options: { idempotencyKey: string }
    ) => Promise<{
      data: { id: string } | null;
      error: { message?: string } | null;
    }>;
  };
};

export function createResendOrderEmailSender(resend: ResendLike): OrderEmailSender {
  return async (message, options) => {
    const { data, error } = await resend.emails.send(message, options);
    if (error || !data) {
      throw new Error(`Order email delivery failed: ${error?.message ?? "unknown error"}`);
    }

    return { id: data.id };
  };
}
