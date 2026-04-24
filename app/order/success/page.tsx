import { createServerSupabaseClient } from "@/lib/supabase";
import Logo from "@/components/logo";
import Link from "next/link";

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
      <div className="min-h-dvh bg-white flex flex-col items-center justify-center gap-4 px-6">
        <p
          className="text-[#6b6b6b] text-sm"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Payment not completed.
        </p>
        <Link
          href="/shop"
          className="text-xs tracking-widest uppercase text-[#8ecfb5] underline"
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
    .select("id, items, fulfillment_method, shipping_address, customer_name")
    .eq("stripe_payment_intent", paymentIntentId)
    .maybeSingle();

  return (
    <div className="min-h-dvh bg-white">
      <header className="flex items-center px-6 py-5 border-b border-[#f0f0f0]">
        <Logo size="sm" />
      </header>

      <main className="max-w-lg mx-auto px-6 py-16">
        <div className="mb-10">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-[#8ecfb5] mb-3"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Order Confirmed
          </p>
          <h1
            className="text-4xl font-light text-[#0a0a0a] mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Thank you{order?.customer_name ? `, ${order.customer_name.split(" ")[0]}` : ""}.
          </h1>
          <p
            className="text-[#6b6b6b] text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Your order has been placed and is being processed. You&apos;ll receive a confirmation email shortly.
          </p>
          {order?.id && (
            <p
              className="text-[#6b6b6b] text-xs mt-3"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Order #{order.id.slice(0, 8).toUpperCase()}
            </p>
          )}
        </div>

        {order?.items && Array.isArray(order.items) && order.items.length > 0 && (
          <div className="mb-10">
            <p
              className="text-[10px] tracking-[0.3em] uppercase text-[#6b6b6b] mb-4"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Items Ordered
            </p>
            <div className="divide-y divide-[#e5e7eb]">
              {(
                order.items as {
                  name: string;
                  size: string;
                  quantity: number;
                  price_cents: number;
                }[]
              ).map((item, i) => (
                <div key={i} className="flex justify-between py-3 text-sm">
                  <span
                    className="text-[#0a0a0a]"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {item.name} — Size {item.size}
                    <span className="text-[#6b6b6b] ml-1">×{item.quantity}</span>
                  </span>
                  <span
                    className="text-[#0a0a0a]"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    ${((item.price_cents * item.quantity) / 100).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {order?.fulfillment_method && (
          <div className="mb-10 p-5 bg-[#f5f5f5]">
            <p
              className="text-[10px] tracking-[0.3em] uppercase text-[#6b6b6b] mb-3"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {order.fulfillment_method === "shipping" ? "Shipping To" : "Pickup Details"}
            </p>
            {order.fulfillment_method === "pickup" ? (
              <p
                className="text-sm text-[#0a0a0a] leading-relaxed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Your order will be available for pickup at the mosque. We&apos;ll contact you with the address and pickup window.
              </p>
            ) : order.shipping_address ? (
              <address
                className="text-sm text-[#0a0a0a] not-italic leading-relaxed"
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
            ) : null}
          </div>
        )}

        {!order && (
          <div className="mb-10 p-5 bg-[#f5f5f5]">
            <p
              className="text-sm text-[#6b6b6b]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Your order is being processed. Check your email for confirmation details.
            </p>
          </div>
        )}

        <Link
          href="/shop"
          className="text-xs tracking-[0.2em] uppercase text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors border-b border-[#e5e7eb] hover:border-[#0a0a0a] pb-0.5"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Continue Shopping
        </Link>
      </main>
    </div>
  );
}
