"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "@/components/cart-context";
import Logo from "@/components/logo";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type Fulfillment = "shipping" | "pickup";

type AddressValue = {
  name: string;
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
};

type LineItem = { name: string; size: string; quantity: number; price_cents: number };

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] tracking-[0.25em] uppercase text-white" style={{ fontFamily: "var(--font-sans)" }}>
        {label}
      </label>
      <input
        className="border border-white/20 bg-transparent px-3 py-2.5 text-sm text-white outline-none focus:border-white transition-colors placeholder:text-white/20"
        style={{ fontFamily: "var(--font-sans)" }}
        {...props}
      />
    </div>
  );
}

function OrderSummary({
  items,
  subtotalCents,
  taxCents,
  totalCents,
  fulfillment,
}: {
  items: LineItem[];
  subtotalCents: number;
  taxCents: number | null;
  totalCents: number;
  fulfillment: Fulfillment;
}) {
  return (
    <div className="lg:w-[380px] lg:border-l lg:border-white/10 px-6 lg:px-10 py-12 flex flex-col gap-8 border-t border-white/10 lg:border-t-0">
      <p className="text-[10px] tracking-[0.3em] uppercase text-white" style={{ fontFamily: "var(--font-sans)" }}>
        Order Summary
      </p>

      <div className="space-y-5">
        {items.map((item, i) => (
          <div key={i} className="flex justify-between gap-4">
            <div>
              <p className="text-sm text-white" style={{ fontFamily: "var(--font-sans)" }}>{item.name}</p>
              <p className="text-xs text-white/40 mt-0.5" style={{ fontFamily: "var(--font-sans)" }}>
                Size {item.size} · Qty {item.quantity}
              </p>
            </div>
            <span className="text-sm text-white shrink-0" style={{ fontFamily: "var(--font-sans)" }}>
              ${((item.price_cents * item.quantity) / 100).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <hr className="border-white/10" />

      <div className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="tracking-[0.15em] uppercase text-white/50" style={{ fontFamily: "var(--font-sans)" }}>Subtotal</span>
          <span className="text-white" style={{ fontFamily: "var(--font-sans)" }}>${(subtotalCents / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="tracking-[0.15em] uppercase text-white/50" style={{ fontFamily: "var(--font-sans)" }}>Shipping</span>
          <span className="text-white" style={{ fontFamily: "var(--font-sans)" }}>
            {fulfillment === "pickup" ? "N/A" : "Free"}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="tracking-[0.15em] uppercase text-white/50" style={{ fontFamily: "var(--font-sans)" }}>Tax</span>
          <span className="text-white" style={{ fontFamily: "var(--font-sans)" }}>
            {fulfillment === "pickup"
              ? "N/A"
              : taxCents === null
              ? "Calculated at checkout"
              : `$${(taxCents / 100).toFixed(2)}`}
          </span>
        </div>
        <hr className="border-white/10" />
        <div className="flex justify-between text-sm">
          <span className="tracking-[0.15em] uppercase text-white font-medium" style={{ fontFamily: "var(--font-sans)" }}>Total</span>
          <span className="text-white font-medium" style={{ fontFamily: "var(--font-sans)" }}>${(totalCents / 100).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function CheckoutForm({
  items,
  subtotalCents,
  paymentIntentId,
  onSuccess,
}: {
  items: LineItem[];
  subtotalCents: number;
  paymentIntentId: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("shipping");
  const [email, setEmail] = useState("");
  const [pickupName, setPickupName] = useState("");
  const [addressValue, setAddressValue] = useState<AddressValue | null>(null);
  const [taxCents, setTaxCents] = useState<number | null>(null);
  const [totalCents, setTotalCents] = useState(subtotalCents);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleInfoNext() {
    if (!email.trim()) { setError("Please enter your email."); return; }
    if (fulfillment === "pickup" && !pickupName.trim()) { setError("Please enter your name."); return; }
    setError(null);
    setStep(fulfillment === "shipping" ? 2 : 3);
  }

  async function handleShippingNext() {
    if (!addressValue) { setError("Please complete your shipping address."); return; }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId, address: addressValue.address, items }),
      });
      const data = await res.json();
      if (data.taxCents !== undefined) {
        setTaxCents(data.taxCents);
        setTotalCents(data.totalCents);
      }
    } catch {
      // Non-blocking — proceed to payment even if tax calc fails
    }
    setLoading(false);
    setStep(3);
  }

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError(null);
    setLoading(true);

    try {
      await fetch("/api/checkout", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId, email: email.trim(), fulfillmentMethod: fulfillment }),
      });
    } catch { /* non-blocking */ }

    const confirmParams: Parameters<typeof stripe.confirmPayment>[0]["confirmParams"] = {
      return_url: `${window.location.origin}/order/success`,
      payment_method_data: {
        billing_details: {
          name: fulfillment === "shipping" ? addressValue?.name : pickupName.trim(),
          email: email.trim(),
        },
      },
    };

    if (fulfillment === "shipping" && addressValue) {
      confirmParams.shipping = {
        name: addressValue.name,
        address: {
          line1: addressValue.address.line1,
          line2: addressValue.address.line2 || undefined,
          city: addressValue.address.city,
          state: addressValue.address.state,
          postal_code: addressValue.address.postal_code,
          country: addressValue.address.country,
        },
      };
    }

    const result = await stripe.confirmPayment({ elements, confirmParams });
    if (result.error) {
      setError(result.error.message ?? "Payment failed.");
      setLoading(false);
    } else {
      onSuccess();
    }
  }

  const stepLabels = ["Info", "Shipping", "Payment"];

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Left: form */}
      <div className="flex-1 flex justify-center px-6 lg:px-16 py-12">
        <div className="w-full max-w-[500px]">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-12">
            {stepLabels.map((label, i) => (
              <span
                key={label}
                className={`text-[10px] tracking-[0.3em] uppercase transition-colors ${
                  step === i + 1 ? "text-white" : step > i + 1 ? "text-white/40" : "text-white/20"
                }`}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Step 1: INFO */}
          {step === 1 && (
            <div className="space-y-6">
              <Field
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                required
              />

              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-white mb-3" style={{ fontFamily: "var(--font-sans)" }}>
                  Fulfillment
                </p>
                <div className="flex border border-white w-full">
                  {(["shipping", "pickup"] as Fulfillment[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFulfillment(method)}
                      className={`flex-1 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-200 ${
                        fulfillment === method ? "bg-white text-black" : "bg-transparent text-white hover:text-white/60"
                      }`}
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {method === "shipping" ? "Ship to Me" : "Local Pickup"}
                    </button>
                  ))}
                </div>
                {fulfillment === "pickup" && (
                  <p className="text-white/50 text-xs mt-3" style={{ fontFamily: "var(--font-sans)" }}>
                    Pick up at the mosque. Address provided after purchase.
                  </p>
                )}
              </div>

              {fulfillment === "pickup" && (
                <Field
                  label="Your Name"
                  value={pickupName}
                  onChange={(e) => setPickupName(e.target.value)}
                  placeholder="Full name"
                  required
                />
              )}

              {error && <p className="text-red-400 text-xs" style={{ fontFamily: "var(--font-sans)" }}>{error}</p>}

              <button
                type="button"
                onClick={handleInfoNext}
                className="w-full py-4 border border-white text-white text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-colors duration-200"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Next
              </button>
            </div>
          )}

          {/* Step 2: SHIPPING */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-white mb-4" style={{ fontFamily: "var(--font-sans)" }}>
                  Shipping Address
                </p>
                <AddressElement
                  options={{ mode: "shipping", defaultValues: { address: { country: "US" } } }}
                  onChange={(e) => setAddressValue(e.complete ? (e.value as AddressValue) : null)}
                />
              </div>

              {error && <p className="text-red-400 text-xs" style={{ fontFamily: "var(--font-sans)" }}>{error}</p>}

              <button
                type="button"
                onClick={handleShippingNext}
                disabled={loading}
                className="w-full py-4 border border-white text-white text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {loading ? "Calculating tax..." : "Continue"}
              </button>
            </div>
          )}

          {/* Step 3: PAYMENT */}
          {step === 3 && (
            <form onSubmit={handlePayment} className="space-y-6">
              <PaymentElement options={{ layout: "tabs" }} />

              {error && <p className="text-red-400 text-xs" style={{ fontFamily: "var(--font-sans)" }}>{error}</p>}

              <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full py-4 border border-white text-white text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {loading ? "Processing..." : `Pay $${(totalCents / 100).toFixed(2)}`}
              </button>

              <p className="text-white/30 text-[10px] text-center" style={{ fontFamily: "var(--font-sans)" }}>
                Secure payment via Stripe. Made to order — ships within 2–3 weeks.
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Right: order summary */}
      <OrderSummary
        items={items}
        subtotalCents={subtotalCents}
        taxCents={taxCents}
        totalCents={totalCents}
        fulfillment={fulfillment}
      />
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalCents, clearCart } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [fetchError, setFetchError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/shop");
      return;
    }
    if (hasFetched.current) return;
    hasFetched.current = true;

    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId ?? "");
        } else {
          setFetchError(data.error ?? "Could not initialize checkout.");
        }
      })
      .catch(() => setFetchError("Network error. Please try again."));
  }, [items, router]);

  if (fetchError) {
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center">
        <p className="text-red-400 text-sm" style={{ fontFamily: "var(--font-sans)" }}>{fetchError}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center">
        <p className="text-white text-sm" style={{ fontFamily: "var(--font-sans)" }}>Loading checkout...</p>
      </div>
    );
  }

  const appearance = {
    theme: "night" as const,
    variables: {
      colorPrimary: "#ffffff",
      colorBackground: "#000000",
      colorText: "#ffffff",
      colorTextSecondary: "rgba(255,255,255,0.5)",
      colorDanger: "#f87171",
      fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
      borderRadius: "0px",
      colorBorder: "rgba(255,255,255,0.2)",
    },
  };

  return (
    <div className="min-h-dvh bg-black">
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-6 py-5 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <Logo size="sm" />
      </header>

      <div className="pt-[73px]">
        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
          <CheckoutForm
            items={items}
            subtotalCents={totalCents}
            paymentIntentId={paymentIntentId}
            onSuccess={clearCart}
          />
        </Elements>
      </div>
    </div>
  );
}
