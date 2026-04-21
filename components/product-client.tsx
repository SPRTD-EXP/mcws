"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GeometricDivider from "./geometric-divider";

gsap.registerPlugin(ScrollTrigger);

type FulfillmentMethod = "shipping" | "pickup";

interface Product {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  sizes: string[];
  images: string[];
}

interface ProductClientProps {
  product: Product | null;
}

const FALLBACK_IMAGES = [
  "/placeholder-hoodie-1.jpg",
  "/placeholder-hoodie-2.jpg",
  "/placeholder-hoodie-3.jpg",
];

const FALLBACK_PRODUCT: Product = {
  id: "placeholder",
  name: "MCWS Hoodie",
  description:
    "A premium heavyweight hoodie representing the Muslim Community of the Western Suburbs of Detroit. Embroidered MCWS logo. Made to order.",
  price_cents: 6500,
  sizes: ["S", "M", "L", "XL"],
  images: FALLBACK_IMAGES,
};

export default function ProductClient({ product }: ProductClientProps) {
  const p = product ?? FALLBACK_PRODUCT;
  const images = p.images.length > 0 ? p.images : FALLBACK_IMAGES;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>("shipping");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-product]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  async function handleCheckout() {
    if (!selectedSize) {
      setError("Please select a size.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: p.id,
          size: selectedSize,
          fulfillmentMethod: fulfillment,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <section
      ref={sectionRef}
      className="flex flex-col lg:flex-row gap-16 px-6 py-16 md:px-12 max-w-7xl mx-auto w-full"
    >
      {/* Image Gallery */}
      <div data-product className="flex-1 flex flex-col gap-4 opacity-0">
        {/* Main image */}
        <div className="relative aspect-[4/5] bg-[#111] overflow-hidden">
          {images[selectedImage] && !images[selectedImage].startsWith("/placeholder") ? (
            <Image
              src={images[selectedImage]}
              alt={`${p.name} — view ${selectedImage + 1}`}
              fill
              className="object-cover"
              priority={selectedImage === 0}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pattern-overlay">
              <span
                className="text-[#333] text-6xl font-light"
                style={{ fontFamily: "var(--font-display)" }}
              >
                MCWS
              </span>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-16 h-20 bg-[#111] overflow-hidden transition-all duration-200 ${
                  selectedImage === i
                    ? "ring-1 ring-[#8ecfb5]"
                    : "ring-1 ring-[#222] hover:ring-[#444]"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                {img && !img.startsWith("/placeholder") ? (
                  <Image src={img} alt="" fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#111]">
                    <span className="text-[#333] text-xs" style={{ fontFamily: "var(--font-display)" }}>
                      {i + 1}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col max-w-md lg:pt-4">
        <div data-product className="opacity-0">
          <p
            className="text-[#999] text-[10px] tracking-[0.35em] uppercase mb-3"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            MCWS · Made to Order
          </p>
          <h1
            className="text-5xl md:text-6xl font-light leading-tight text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {p.name}
          </h1>
          <p
            className="text-3xl font-light text-white mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ${(p.price_cents / 100).toFixed(0)}
          </p>
        </div>

        <div data-product className="opacity-0 mb-8">
          <p
            className="text-[#999] text-sm leading-7"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {p.description}
          </p>
        </div>

        <GeometricDivider className="mb-8" />

        {/* Size Selector */}
        <div data-product className="opacity-0 mb-8">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-[#999] mb-4"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Select Size
          </p>
          <div className="flex gap-3">
            {p.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 text-sm transition-all duration-200 ${
                  selectedSize === size
                    ? "bg-[#8ecfb5] text-black border border-[#8ecfb5]"
                    : "bg-transparent border border-[#333] text-[#999] hover:border-[#666] hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Fulfillment Toggle */}
        <div data-product className="opacity-0 mb-10">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-[#999] mb-4"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Fulfillment
          </p>
          <div className="flex border border-[#333] w-fit">
            {(["shipping", "pickup"] as FulfillmentMethod[]).map((method) => (
              <button
                key={method}
                onClick={() => setFulfillment(method)}
                className={`px-5 py-2.5 text-xs tracking-[0.15em] uppercase transition-all duration-200 ${
                  fulfillment === method
                    ? "bg-[#8ecfb5] text-black"
                    : "bg-transparent text-[#999] hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {method === "shipping" ? "Ship to Me" : "Local Pickup"}
              </button>
            ))}
          </div>
          {fulfillment === "pickup" && (
            <p
              className="text-[#999] text-xs leading-5 mt-3"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Pick up at the mosque. Address provided after purchase.
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <p
            className="text-red-400 text-xs mb-4"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {error}
          </p>
        )}

        {/* CTA */}
        <div data-product className="opacity-0">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-4 bg-[#8ecfb5] text-black text-xs tracking-[0.25em] uppercase hover:bg-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {loading ? "Redirecting..." : "Buy Now"}
          </button>

          <p
            className="text-[#555] text-[10px] text-center mt-4 leading-5"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Secure checkout via Stripe. Made to order — ships within 2–3 weeks.
          </p>
        </div>
      </div>
    </section>
  );
}
