import { createServerSupabaseClient } from "@/lib/supabase";
import Logo from "@/components/logo";
import Link from "next/link";
import ClearCartOnSuccess from "@/components/clear-cart-on-success";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_intent?: string; redirect_status?: string }>;
}) {
  const params = await searchParams;
  const paymentIntentId = params.payment_intent;
  const redirectStatus = params.redirect_status;

  if (redirectStatus !== "succeeded" || !paymentIntentId) {
    return (
      <div className="min-h-dvh bg-black flex flex-col items-center justify-center gap-4 px-6">
        <p
          className="text-white/50 text-sm"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Payment not completed.
        </p>
        <Link
          href="/shop"
          className="text-xs tracking-widest uppercase text-white underline"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const supabase = createServerSupabaseClient();
  const { data: order } = await supabase
    .from("orders")
    .select("id, order_number, fulfillment_method, shipping_address, customer_name, order_items(name, size, quantity, unit_price_cents, line_total_cents)")
    .eq("stripe_payment_intent", paymentIntentId)
    .maybeSingle();

  return (
    <div className="min-h-dvh bg-black">
      <header className="flex items-center px-6 py-5 border-b border-white/10">
        <Logo size="sm" />
      </header>

      <ClearCartOnSuccess />
      <main className="max-w-lg mx-auto px-6 py-16 text-center">
        <div className="mb-10">
          <h1
            className="text-4xl font-light text-white mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Thank you{order?.customer_name ? `, ${order.customer_name.split(" ")[0]}` : ""}.
          </h1>
          <p
            className="text-white/50 text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Your order has been placed and is being processed. You&apos;ll receive a confirmation email shortly.
          </p>
          {order?.order_number && (
            <p
              className="text-white/40 text-xs mt-3"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Order #{order.order_number}
            </p>
          )}
        </div>

        {order?.order_items && order.order_items.length > 0 && (
          <div className="mb-10">
            <p
              className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Items Ordered
            </p>
            <div className="divide-y divide-white/10">
              {order.order_items.map((item, i) => (
                <div key={i} className="flex justify-between py-3 text-sm">
                  <span className="text-white" style={{ fontFamily: "var(--font-sans)" }}>
                    {item.name} — Size {item.size}
                    <span className="text-white/40 ml-1">×{item.quantity}</span>
                  </span>
                  <span className="text-white" style={{ fontFamily: "var(--font-sans)" }}>
                    ${(item.line_total_cents / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {order?.shipping_address && (
          <div className="mb-10 p-5 bg-[#111] border border-white/10">
            <p
              className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Shipping To
            </p>
            <address
              className="text-sm text-white/70 not-italic leading-relaxed"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {(order.shipping_address as Record<string, string>).line1}
              <br />
              {(order.shipping_address as Record<string, string>).line2 && (
                <>
                  {(order.shipping_address as Record<string, string>).line2}
                  <br />
                </>
              )}
              {(order.shipping_address as Record<string, string>).city},{" "}
              {(order.shipping_address as Record<string, string>).state}{" "}
              {(order.shipping_address as Record<string, string>).postal_code}
            </address>
          </div>
        )}

        <Link
          href="/shop"
          className="block w-full py-4 border border-white text-white text-xs tracking-[0.25em] uppercase text-center hover:bg-white hover:text-black transition-colors duration-200"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Continue Shopping
        </Link>
      </main>
    </div>
  );
}
