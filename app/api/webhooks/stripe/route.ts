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
    return new Response("Webhook signature verification failed", {
      status: 400,
    });
  }

  if (event.type !== "checkout.session.completed") {
    return new Response("OK", { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const meta = session.metadata ?? {};

  const productId = meta.product_id;
  const size = meta.size;
  const fulfillmentMethod = meta.fulfillment_method as "shipping" | "pickup";

  if (!productId || !size || !fulfillmentMethod) {
    console.error("Webhook: missing metadata", meta);
    return new Response("Missing metadata", { status: 400 });
  }

  const shippingAddress =
    session.collected_information?.shipping_details?.address ?? null;

  const customerDetails = session.customer_details;
  const customerName = customerDetails?.name ?? "Customer";
  const customerEmail = customerDetails?.email ?? "";

  const supabase = createServiceSupabaseClient();

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      product_id: productId,
      size,
      quantity: 1,
      customer_name: customerName,
      customer_email: customerEmail,
      fulfillment_method: fulfillmentMethod,
      shipping_address: shippingAddress,
      stripe_session_id: session.id,
      stripe_payment_intent:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
      payment_status: "paid",
      fulfillment_status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("Webhook: failed to insert order", error);
    return new Response("Database error", { status: 500 });
  }

  try {
    await notifyManufacturer({
      orderId: order.id,
      customerName,
      customerEmail,
      size,
      fulfillmentMethod,
      shippingAddress,
    });
  } catch (notifyError) {
    // Log but don't fail — order is already saved
    console.error("Webhook: notification failed", notifyError);
  }

  return new Response("OK", { status: 200 });
}
