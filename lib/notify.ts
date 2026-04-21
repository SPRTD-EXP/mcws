import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

interface OrderDetails {
  orderId: string;
  customerName: string;
  customerEmail: string;
  size: string;
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

  const addressBlock = isShipping && order.shippingAddress
    ? `
      <p><strong>Ship To:</strong><br>
      ${order.shippingAddress.line1}${order.shippingAddress.line2 ? ", " + order.shippingAddress.line2 : ""}<br>
      ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}<br>
      ${order.shippingAddress.country}</p>
    `
    : "<p><strong>Fulfillment:</strong> Local Pickup — deliver to mosque.</p>";

  await getResend().emails.send({
    from: "MCWS Orders <orders@mcws.org>",
    to: recipientEmail,
    subject: `New Order — ${order.size} Hoodie (${isShipping ? "Ship" : "Pickup"})`,
    html: `
      <div style="font-family: sans-serif; max-width: 500px; color: #111;">
        <h2 style="font-size: 20px; margin-bottom: 4px;">New MCWS Order</h2>
        <p style="color: #666; font-size: 13px;">Order ID: ${order.orderId.slice(0, 8).toUpperCase()}</p>
        <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;">
        <p><strong>Customer:</strong> ${order.customerName}</p>
        <p><strong>Email:</strong> ${order.customerEmail}</p>
        <p><strong>Product:</strong> MCWS Hoodie — Size ${order.size}</p>
        ${addressBlock}
        <hr style="margin: 16px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #999;">Sent automatically from mcws.org</p>
      </div>
    `,
  });
}
