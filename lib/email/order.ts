export type OrderAddress = {
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type OrderEmailItem = {
  sku: string;
  name: string;
  variant: string;
  quantity: number;
  unitAmountCents: number;
  lineAmountCents: number;
  customization?: string;
};

export type OrderEmailData = {
  orderId: string;
  placedAt: string;
  customer: {
    name: string;
    email: string;
  };
  shippingAddress: OrderAddress;
  items: OrderEmailItem[];
  amountTotalCents: number;
  currency: string;
};

type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

export type OrderEmailMessage = EmailContent & {
  from: string;
  to: string;
  replyTo: string;
};

export type OrderEmailSender = (
  message: OrderEmailMessage,
  options: { idempotencyKey: string }
) => Promise<{ id?: string }>;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMoney(amountCents: number, currency: string): string {
  return `${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountCents / 100)} ${currency.toUpperCase()}`;
}

function addressLines(address: OrderAddress): string[] {
  return [
    address.line1,
    address.line2,
    `${address.city}, ${address.state} ${address.postalCode}`,
    address.country,
  ].filter((line): line is string => Boolean(line));
}

function itemLine(item: OrderEmailItem): string {
  const customization = item.customization ? ` (${item.customization})` : "";
  return `${item.quantity} × ${item.name} — ${item.variant}${customization}`;
}

function emailShell(title: string, body: string): string {
  return `<!doctype html>
<html><body style="margin:0;background:#fff8ef;color:#3f2618;font-family:Arial,sans-serif">
<div style="max-width:640px;margin:0 auto;padding:32px 20px">
  <div style="background:#ffffff;border:1px solid #ead7c2;border-radius:14px;overflow:hidden">
    <div style="background:#8b5a17;color:#ffffff;padding:22px 28px">
      <div style="font-size:13px;letter-spacing:1.5px;text-transform:uppercase">Marilyn's Morsels</div>
      <h1 style="font-size:26px;line-height:1.25;margin:8px 0 0">${escapeHtml(title)}</h1>
    </div>
    <div style="padding:26px 28px;line-height:1.55">${body}</div>
  </div>
</div>
</body></html>`;
}

export function buildOrderEmailContent(order: OrderEmailData): {
  business: EmailContent;
  customer: EmailContent;
} {
  const total = formatMoney(order.amountTotalCents, order.currency);
  const itemsText = order.items.map(itemLine).join("\n");
  const itemsHtml = order.items
    .map(
      (item) =>
        `<li style="margin:0 0 10px"><strong>${escapeHtml(
          itemLine(item)
        )}</strong><br><span>${escapeHtml(
          formatMoney(item.lineAmountCents, order.currency)
        )}</span></li>`
    )
    .join("");
  const addressText = addressLines(order.shippingAddress).join("\n");
  const addressHtml = addressLines(order.shippingAddress)
    .map(escapeHtml)
    .join("<br>");
  const placedAt = new Date(order.placedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  });

  const businessText = `NEW PAID ORDER

Order: ${order.orderId}
Placed: ${placedAt} ET
Customer: ${order.customer.name}
Email: ${order.customer.email}

ITEMS TO MAKE
${itemsText}

SHIP TO
${addressText}

TOTAL: ${total}

Reply to this email to contact the customer.`;

  const businessHtml = emailShell(
    "New paid order",
    `<p style="margin-top:0"><strong>Order:</strong> ${escapeHtml(
      order.orderId
    )}<br><strong>Placed:</strong> ${escapeHtml(
      `${placedAt} ET`
    )}</p><h2 style="font-size:18px;margin-top:26px">Items to make</h2><ul style="padding-left:22px">${itemsHtml}</ul><h2 style="font-size:18px;margin-top:26px">Customer</h2><p>${escapeHtml(
      order.customer.name
    )}<br><a href="mailto:${escapeHtml(order.customer.email)}">${escapeHtml(
      order.customer.email
    )}</a></p><h2 style="font-size:18px;margin-top:26px">Ship to</h2><p>${addressHtml}</p><p style="font-size:20px;margin-top:26px"><strong>Total: ${escapeHtml(
      total
    )}</strong></p><p style="color:#72533f">Reply to this email to contact the customer.</p>`
  );

  const customerText = `We received your order

Thanks, ${order.customer.name}! Your cookies are in Marilyn's baking queue.

ORDER
${itemsText}

DELIVERY ADDRESS
${addressText}

TOTAL: ${total}
Order reference: ${order.orderId}

Questions? Reply to this email.`;

  const customerHtml = emailShell(
    "We received your order",
    `<p style="margin-top:0">Thanks, ${escapeHtml(
      order.customer.name
    )}! Your cookies are in Marilyn's baking queue.</p><h2 style="font-size:18px;margin-top:26px">Your order</h2><ul style="padding-left:22px">${itemsHtml}</ul><h2 style="font-size:18px;margin-top:26px">Delivery address</h2><p>${addressHtml}</p><p style="font-size:20px;margin-top:26px"><strong>Total: ${escapeHtml(
      total
    )}</strong></p><p style="color:#72533f">Order reference: ${escapeHtml(
      order.orderId
    )}<br>Questions? Reply to this email.</p>`
  );

  return {
    business: {
      subject: `NEW PAID ORDER — ${total} — ${order.customer.name}`,
      html: businessHtml,
      text: businessText,
    },
    customer: {
      subject: "We received your order — Marilyn's Morsels",
      html: customerHtml,
      text: customerText,
    },
  };
}

export async function sendOrderEmails(
  order: OrderEmailData,
  send: OrderEmailSender,
  config: { from: string; businessEmail: string }
): Promise<void> {
  const content = buildOrderEmailContent(order);

  await send(
    {
      ...content.business,
      from: config.from,
      to: config.businessEmail,
      replyTo: order.customer.email,
    },
    { idempotencyKey: `order-business/${order.orderId}` }
  );

  await send(
    {
      ...content.customer,
      from: config.from,
      to: order.customer.email,
      replyTo: config.businessEmail,
    },
    { idempotencyKey: `order-customer/${order.orderId}` }
  );
}
