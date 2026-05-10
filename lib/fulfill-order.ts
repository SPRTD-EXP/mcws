import { getStripe } from "@/lib/stripe";
import { createServiceSupabaseClient } from "@/lib/supabase";
import { notifyManufacturer } from "@/lib/notify";
import { notifyCustomer } from "@/lib/notify-customer";

interface CartItem {
  productId?: string;
  stripePriceId?: string;
  name: string;
  size?: string;
  quantity: number;
  price_cents: number;
}

export type FulfillResult =
  | { status: "not_paid" }
  | { status: "no_items" }
  | { status: "already_fulfilled"; order: { id: string; order_number: number } }
  | { status: "fulfilled"; order: { id: string; order_number: number } }
  | { status: "error"; message: string };

export async function fulfillOrder(paymentIntentId: string): Promise<FulfillResult> {
  const stripe = getStripe();
  const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (pi.status !== "succeeded") {
    return { status: "not_paid" };
  }

  const supabase = createServiceSupabaseClient();

  // Idempotency — skip if already processed
  const { data: existing } = await supabase
    .from("orders")
    .select("id, order_number")
    .eq("stripe_payment_intent", paymentIntentId)
    .maybeSingle();

  if (existing) {
    return { status: "already_fulfilled", order: existing };
  }

  const meta = pi.metadata ?? {};
  const items: CartItem[] = meta.items ? JSON.parse(meta.items) : [];

  if (!items.length) {
    console.error("fulfillOrder: no items in metadata for PI", paymentIntentId);
    return { status: "no_items" };
  }

  const shipping = pi.shipping;
  const fulfillmentMethod = "shipping" as const;
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

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      items,
      product_id: items[0]?.productId ?? null,
      quantity: items.reduce((sum, i) => sum + i.quantity, 0),
      customer_name: customerName,
      customer_email: pi.receipt_email ?? meta.email ?? "",
      fulfillment_method: fulfillmentMethod,
      shipping_address: shippingAddress,
      billing_address: shippingAddress,
      stripe_session_id: pi.id,
      stripe_payment_intent: pi.id,
      payment_status: "paid",
      fulfillment_status: "pending",
    })
    .select("id, order_number")
    .single();

  if (error || !order) {
    console.error("fulfillOrder: failed to insert order", error);
    return { status: "error", message: error?.message ?? "Insert failed" };
  }

  const orderItemRows = items.map((item) => ({
    order_id: order.id,
    product_id: item.productId ?? null,
    stripe_price_id: item.stripePriceId ?? null,
    name: item.name,
    size: item.size ?? null,
    quantity: item.quantity,
    unit_price_cents: item.price_cents,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItemRows);
  if (itemsError) {
    console.error("fulfillOrder: failed to insert order_items", itemsError);
  }

  for (const item of items) {
    if (!item.productId || !item.size) continue;
    const { data: decremented, error: rpcError } = await supabase.rpc("decrement_stock", {
      p_product_id: item.productId,
      p_size: item.size,
      p_qty: item.quantity,
    });
    if (rpcError) {
      console.error(`fulfillOrder: decrement_stock error for ${item.size}:`, rpcError);
    }
    if (!decremented) {
      console.warn(`fulfillOrder: stock already depleted for ${item.size} on order ${order.id}`);
      await supabase
        .from("orders")
        .update({ notes: `Stock depleted for size ${item.size} at fulfillment` })
        .eq("id", order.id);
    }
  }

  const taxCents = parseInt(meta.tax_cents || "0");
  const customerEmail = pi.receipt_email ?? meta.email ?? "";

  const notifyItems = items.map((i) => ({ ...i, size: i.size ?? "" }));

  try {
    await notifyManufacturer({
      orderId: order.id,
      orderNumber: order.order_number,
      customerName,
      customerEmail,
      items: notifyItems,
      fulfillmentMethod,
      shippingAddress,
    });
  } catch (err) {
    console.error("fulfillOrder: manufacturer notification failed", err);
  }

  try {
    await notifyCustomer({
      orderNumber: order.order_number,
      customerName,
      customerEmail,
      items: notifyItems,
      fulfillmentMethod,
      shippingAddress,
      subtotalCents: pi.amount - taxCents,
      taxCents,
      totalCents: pi.amount,
    });
  } catch (err) {
    console.error("fulfillOrder: customer notification failed", err);
  }

  return { status: "fulfilled", order };
}
