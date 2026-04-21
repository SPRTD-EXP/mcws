import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { productId, size, fulfillmentMethod } = body as {
    productId: string;
    size: string;
    fulfillmentMethod: "shipping" | "pickup";
  };

  if (!productId || !size || !fulfillmentMethod) {
    return Response.json({ error: "Missing required fields." }, { status: 400 });
  }

  // Fetch product from Supabase to get authoritative price
  const supabase = createServerSupabaseClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("id, name, price_cents, is_active")
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (error || !product) {
    return Response.json({ error: "Product not found." }, { status: 404 });
  }

  const baseUrl = req.nextUrl.origin;

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: product.price_cents,
          product_data: {
            name: `${product.name} — Size ${size}`,
            description: "Muslim Community of the Western Suburbs of Detroit",
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      product_id: product.id,
      size,
      fulfillment_method: fulfillmentMethod,
    },
    ...(fulfillmentMethod === "shipping"
      ? {
          shipping_address_collection: {
            allowed_countries: ["US"],
          },
        }
      : {}),
    success_url: `${baseUrl}/order/{CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/shop`,
  });

  return Response.json({ url: session.url });
}
