import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase";

interface CartItem {
  productId: string;
  name: string;
  price_cents: number;
  stripePriceId: string;
  size: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { items } = body as { items: CartItem[] };

  if (!items || items.length === 0) {
    return Response.json({ error: "Cart is empty." }, { status: 400 });
  }

  const stripe = getStripe();
  let totalCents = 0;
  const validatedItems: CartItem[] = [];

  for (const item of items) {
    if (!item.stripePriceId) {
      return Response.json(
        { error: "Product is not linked to a Stripe price. Please set NEXT_PUBLIC_STRIPE_PRICE_ID." },
        { status: 400 }
      );
    }

    // Fetch authoritative price from Stripe
    const price = await stripe.prices.retrieve(item.stripePriceId);

    if (!price.active || price.unit_amount === null) {
      return Response.json(
        { error: `Stripe price ${item.stripePriceId} is inactive or has no amount.` },
        { status: 400 }
      );
    }

    const validItem: CartItem = {
      productId: item.productId,
      name: item.name,
      price_cents: price.unit_amount,
      stripePriceId: item.stripePriceId,
      size: item.size,
      quantity: item.quantity,
    };
    validatedItems.push(validItem);
    totalCents += price.unit_amount * item.quantity;
  }

  // Validate stock for each item before charging the customer
  const supabase = createServerSupabaseClient();
  const uniqueProductIds = [...new Set(validatedItems.map((i) => i.productId))];
  for (const productId of uniqueProductIds) {
    const { data: productRow } = await supabase
      .from("products")
      .select("stock")
      .eq("id", productId)
      .single();

    const stock = (productRow?.stock ?? {}) as Record<string, number>;
    for (const item of validatedItems.filter((i) => i.productId === productId)) {
      const available = stock[item.size] ?? 0;
      if (available < item.quantity) {
        return Response.json(
          { error: `${item.size} is out of stock` },
          { status: 400 }
        );
      }
    }
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCents,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata: {
      items: JSON.stringify(validatedItems),
    },
  });

  return Response.json({
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
}

export async function PATCH(req: NextRequest) {
  const { paymentIntentId, email, fulfillmentMethod } = await req.json();
  if (!paymentIntentId) {
    return Response.json({ error: "Missing paymentIntentId" }, { status: 400 });
  }
  const stripe = getStripe();
  await stripe.paymentIntents.update(paymentIntentId, {
    receipt_email: email || undefined,
    metadata: { fulfillment_method: fulfillmentMethod },
  });
  return Response.json({ ok: true });
}
