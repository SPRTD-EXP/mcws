"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCart } from "@/components/cart-context";
import Logo from "@/components/logo";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type Fulfillment = "shipping" | "pickup";

function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[10px] tracking-[0.25em] uppercase text-white/40"
        style={{ fontFamily: "var(--font-sans)" }}
      >
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

function CheckoutForm({
  items,
  totalCents,
  onSuccess,
}: {
  items: { name: string; size: string; quantity: number; price_cents: number }[];
  totalCents: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("shipping");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (
      fulfillment === "shipping" &&
      (!address1.trim() || !city.trim() || !state.trim() || !zip.trim())
    ) {
      setError("Please complete your shipping address.");
      return;
    }

    setError(null);
    setLoading(true);

    type ConfirmParams = Parameters<typeof stripe.confirmPayment>[0]["confirmParams"];
    const confirmParams: ConfirmParams = {
      return_url: `${window.location.origin}/order/success`,
      payment_method_data: {
        billing_details: {
          name: `${firstName.trim()} ${lastName.trim()}`,
        },
      },
    };

    if (fulfillment === "shipping") {
      confirmParams.shipping = {
        name: `${firstName.trim()} ${lastName.trim()}`,
        address: {
          line1: address1.trim(),
          line2: address2.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          postal_code: zip.trim(),
          country: "US",
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

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Order summary */}
      <div>
        <p
          className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Order Summary
        </p>
        <div className="divide-y divide-white/10">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between py-3 text-sm">
              <span
                className="text-white"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {item.name} — Size {item.size}
                <span className="text-white/40 ml-1">×{item.quantity}</span>
              </span>
              <span
                className="text-white"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                ${((item.price_cents * item.quantity) / 100).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between pt-3 border-t border-white/20 text-sm font-medium">
          <span className="text-white" style={{ fontFamily: "var(--font-sans)" }}>Total</span>
          <span className="text-white" style={{ fontFamily: "var(--font-sans)" }}>
            ${(totalCents / 100).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Fulfillment toggle */}
      <div>
        <p
          className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Fulfillment
        </p>
        <div className="flex border border-white/20 w-fit">
          {(["shipping", "pickup"] as Fulfillment[]).map((method) => (
            <button
              type="button"
              key={method}
              onClick={() => setFulfillment(method)}
              className={`px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-200 ${
                fulfillment === method
                  ? "bg-white text-black"
                  : "bg-transparent text-white/50 hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {method === "shipping" ? "Ship to Me" : "Local Pickup"}
            </button>
          ))}
        </div>
        {fulfillment === "pickup" && (
          <p
            className="text-white/40 text-xs leading-5 mt-3"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Pick up at the mosque. Address provided after purchase.
          </p>
        )}
      </div>

      {/* Name */}
      <div>
        <p
          className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Your Name
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Field
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Shipping address */}
      {fulfillment === "shipping" && (
        <div>
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Shipping Address
          </p>
          <div className="space-y-3">
            <Field
              label="Address"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              placeholder="123 Main St"
              required
            />
            <Field
              label="Apt, suite, etc. (optional)"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              placeholder="Apt 4B"
            />
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Field
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <Field
                label="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="MI"
                maxLength={2}
                required
              />
            </div>
            <div className="w-40">
              <Field
                label="ZIP Code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="48001"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment */}
      <div>
        <p
          className="text-[10px] tracking-[0.3em] uppercase text-white/40 mb-4"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Payment
        </p>
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {error && (
        <p
          className="text-red-400 text-xs"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-4 border border-white text-white text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {loading ? "Processing..." : `Pay $${(totalCents / 100).toFixed(2)}`}
      </button>

      <p
        className="text-white/30 text-[10px] text-center leading-5"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        Secure payment via Stripe. Made to order — ships within 2–3 weeks.
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalCents, clearCart } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
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
        } else {
          setFetchError(data.error ?? "Could not initialize checkout.");
        }
      })
      .catch(() => setFetchError("Network error. Please try again."));
  }, [items, router]);

  if (fetchError) {
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center">
        <p
          className="text-red-400 text-sm"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {fetchError}
        </p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center">
        <p
          className="text-white/40 text-sm"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Loading checkout...
        </p>
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

      <main className="pt-24 pb-16 px-6 max-w-lg mx-auto">
        <h1
          className="text-4xl font-light text-white mb-10"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Complete Your Order
        </h1>

        <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
          <CheckoutForm
            items={items}
            totalCents={totalCents}
            onSuccess={clearCart}
          />
        </Elements>
      </main>
    </div>
  );
}
