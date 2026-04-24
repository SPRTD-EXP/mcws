import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceSupabaseClient } from "@/lib/supabase";
import { notifyManufacturer } from "@/lib/notify";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
  }

  return new Response("OK", { status: 200 });
}

async function handlePaymentIntentSucceeded(pi: Stripe.PaymentIntent) {
  const meta = pi.metadata ?? {};
  const items = meta.items ? JSON.parse(meta.items) : [];

  if (!items.length) {
    console.error("Webhook: no items in metadata", meta);
    return;
  }

  const shipping = pi.shipping;
  const fulfillmentMethod = shipping?.address ? "shipping" : "pickup";
  const customerName = shipping?.name ?? "Customer";

  const shippingAddress = shipping?.address
    ? {
        line1: shipping.address.line1,
        line2: shipping.address.line2,
        city: shipping.address.city,
        state: shipping.address.state,
        postal_code: shipping.address.postal_code,
        country: shipping.address.country,
      }
    : null;

  const supabase = createServiceSupabaseClient();

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      items,
      product_id: items[0]?.productId ?? null,
      size: items[0]?.size ?? null,
      quantity: items.reduce((sum: number, i: { quantity: number }) => sum + i.quantity, 0),
      customer_name: customerName,
      customer_email: pi.receipt_email ?? "",
      fulfillment_method: fulfillmentMethod,
      shipping_address: shippingAddress,
      stripe_session_id: pi.id,
      stripe_payment_intent: pi.id,
      payment_status: "paid",
      fulfillment_status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Webhook: failed to insert order", error);
    return;
  }

  try {
    await notifyManufacturer({
      orderId: order.id,
      customerName,
      customerEmail: pi.receipt_email ?? "",
      items,
      fulfillmentMethod,
      shippingAddress,
    });
  } catch (err) {
    console.error("Webhook: notification failed", err);
  }
}
