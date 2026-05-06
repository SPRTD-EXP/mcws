export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import GeometricDivider from "@/components/geometric-divider";
import { createServerSupabaseClient } from "@/lib/supabase";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getOrder(id: string) {
  const supabase = createServerSupabaseClient();

  // Support both Stripe session ID and internal order UUID
  const { data } = await supabase
    .from("orders")
    .select("*")
    .or(`id.eq.${id},stripe_session_id.eq.${id}`)
    .single();

  return data;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  const addr = order.shipping_address as {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  } | null;

  return (
    <>
      <Nav />
      <main className="flex flex-col flex-1 pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-xl mx-auto w-full">
          {/* Header */}
          <div className="mb-12">
            <p
              className="text-white/60 text-[10px] tracking-[0.4em] uppercase mb-4"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Order Confirmed
            </p>
            <h1
              className="text-5xl md:text-6xl font-light leading-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              On its way.
            </h1>
            <p
              className="text-[#999] text-sm leading-7 mt-4"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              JazakAllahu Khayran — your order has been received. We will
              begin producing it shortly.
            </p>
          </div>

          <GeometricDivider className="mb-10" />

          {/* Order Summary */}
          <div className="space-y-5 mb-10">
            <Row label="Order ID" value={order.id.slice(0, 8).toUpperCase()} />
            <Row label="Product" value={order.size ? `MCWS Hoodie — Size ${order.size}` : "MCWS Hoodie"} />
            <Row label="Fulfillment" value="Shipping" />
            <Row label="Payment" value="Paid" accent />
          </div>

          <GeometricDivider className="mb-10" />

          {/* Shipping details */}
          <div>
            <p
              className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-5"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Shipping Details
            </p>
            {addr && (
              <address
                className="not-italic text-sm text-[#999] leading-7"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {addr.line1}
                {addr.line2 && <>, {addr.line2}</>}
                <br />
                {addr.city}, {addr.state} {addr.postal_code}
                <br />
                {addr.country}
              </address>
            )}
            {order.tracking_number ? (
              <div className="mt-6">
                <p
                  className="text-[10px] tracking-[0.3em] uppercase text-[#999] mb-2"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Tracking
                </p>
                {order.tracking_url ? (
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white hover:text-white/60 transition-colors underline underline-offset-4"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {order.tracking_number}
                  </a>
                ) : (
                  <span
                    className="text-sm text-white"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {order.tracking_number}
                  </span>
                )}
              </div>
            ) : (
              <p
                className="text-[#555] text-xs mt-6 leading-5"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Tracking information will be added once your order ships.
                Allow 2–3 weeks for production and delivery.
              </p>
            )}
          </div>

          <div className="mt-14 text-center">
            <a
              href="/"
              className="text-xs tracking-[0.2em] uppercase text-[#555] hover:text-white transition-colors duration-200"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              ← Return Home
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className="text-[10px] tracking-[0.25em] uppercase text-[#555]"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {label}
      </span>
      <span
        className={`text-sm ${accent ? "text-white" : "text-[#999]"}`}
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {value}
      </span>
    </div>
  );
}
