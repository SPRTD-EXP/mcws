import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

interface CartItem {
  name: string;
  size: string;
  quantity: number;
  price_cents: number;
}

interface OrderDetails {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  fulfillmentMethod: "shipping" | "pickup";
  shippingAddress?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
}

export async function notifyManufacturer(order: OrderDetails) {
  const recipientEmail = process.env.MANUFACTURER_EMAIL!;
  const isShipping = order.fulfillmentMethod === "shipping";
  const totalCents = order.items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);

  const itemRows = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:6px 0;border-bottom:1px solid #eee;">${item.name} — Size ${item.size}</td>
          <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right;">×${item.quantity}</td>
          <td style="padding:6px 0;border-bottom:1px solid #eee;text-align:right;">$${((item.price_cents * item.quantity) / 100).toFixed(2)}</td>
        </tr>`
    )
    .join("");

  const addressBlock =
    isShipping && order.shippingAddress
      ? `<p><strong>Ship To:</strong><br>
        ${order.shippingAddress.line1}${order.shippingAddress.line2 ? ", " + order.shippingAddress.line2 : ""}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}</p>`
      : "<p><strong>Fulfillment:</strong> Local Pickup — deliver to mosque.</p>";

  await getResend().emails.send({
    from: "MCWS Orders <orders@mcws.org>",
    to: recipientEmail,
    subject: `New Order — ${order.items.length} item${order.items.length > 1 ? "s" : ""} (${isShipping ? "Ship" : "Pickup"})`,
    html: `
      <div style="font-family:sans-serif;max-width:540px;color:#111;">
        <h2 style="font-size:20px;margin-bottom:4px;">New MCWS Order</h2>
        <p style="color:#666;font-size:13px;">Order ID: ${order.orderId.slice(0, 8).toUpperCase()}</p>
        <hr style="margin:16px 0;border:none;border-top:1px solid #eee;">
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Email:</strong> ${order.customerEmail}</p>
        <table style="width:100%;border-collapse:collapse;margin:12px 0;">
          <thead>
            <tr>
              <th style="text-align:left;padding:6px 0;border-bottom:2px solid #eee;">Item</th>
              <th style="text-align:right;padding:6px 0;border-bottom:2px solid #eee;">Qty</th>
              <th style="text-align:right;padding:6px 0;border-bottom:2px solid #eee;">Price</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding:8px 0;font-weight:600;">Total</td>
              <td style="padding:8px 0;font-weight:600;text-align:right;">$${(totalCents / 100).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        ${addressBlock}
        <hr style="margin:16px 0;border:none;border-top:1px solid #eee;">
        <p style="font-size:12px;color:#999;">Sent automatically from mcws.org</p>
      </div>
    `,
  });
}
