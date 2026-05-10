import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { fulfillOrder } from "@/lib/fulfill-order";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  console.log("🪝 Webhook POST received");
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.log("🪝 Missing stripe-signature header");
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.log("🪝 Signature verification failed:", err);
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  console.log("🪝 Event type:", event.type);

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const result = await fulfillOrder(pi.id);
    console.log("🪝 fulfillOrder result:", result.status);
  }

  return new Response("OK", { status: 200 });
}
