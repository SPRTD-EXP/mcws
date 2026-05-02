import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const { paymentIntentId, address, items } = await req.json();

  if (!paymentIntentId || !address || !items?.length) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const stripe = getStripe();

  const calculation = await stripe.tax.calculations.create({
    currency: "usd",
    line_items: items.map((item: { name: string; size?: string; price_cents: number; quantity: number }) => ({
      amount: item.price_cents * item.quantity,
      reference: `${item.name}${item.size ? ` - ${item.size}` : ""}`,
      tax_behavior: "exclusive",
    })),
    customer_details: {
      address: {
        line1: address.line1,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country: address.country,
      },
      address_source: "shipping",
    },
  });

  await stripe.paymentIntents.update(paymentIntentId, {
    amount: calculation.amount_total,
    metadata: { tax_cents: String(calculation.tax_amount_exclusive) },
  });

  return Response.json({
    taxCents: calculation.tax_amount_exclusive,
    totalCents: calculation.amount_total,
  });
}
