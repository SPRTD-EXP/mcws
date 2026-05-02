import { render } from "@react-email/render";
import { Resend } from "resend";
import OrderConfirmationEmail, { type OrderConfirmationProps } from "./emails/order-confirmation";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

export async function notifyCustomer(order: OrderConfirmationProps) {
  const html = await render(OrderConfirmationEmail(order));
  await getResend().emails.send({
    from: "MCWS <orders@mcws.org>",
    to: order.customerEmail,
    subject: `Order #${order.orderNumber} Confirmed — MCWS`,
    html,
  });
}
