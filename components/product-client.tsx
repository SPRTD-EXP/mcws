"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GeometricDivider from "./geometric-divider";
import { useCart } from "./cart-context";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  stripe_price_id: string | null;
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
  stripe_price_id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ?? null,
  sizes: ["S", "M", "L", "XL"],
  images: FALLBACK_IMAGES,
};

export default function ProductClient({ product }: ProductClientProps) {
  const p = product ?? FALLBACK_PRODUCT;
  const images = p.images.length > 0 ? p.images : FALLBACK_IMAGES;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const { addItem, openCart } = useCart();
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

  function handleAddToCart() {
    if (!selectedSize) {
      setError("Please select a size.");
      return;
    }
    setError(null);
    addItem({
      productId: p.id,
      name: p.name,
      price_cents: p.price_cents,
      stripePriceId: p.stripe_price_id ?? "",
      size: selectedSize,
      quantity,
      image: images[0],
    });
    openCart();
    setQuantity(1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <section
      ref={sectionRef}
      className="flex flex-col lg:flex-row gap-16 px-6 py-16 md:px-12 max-w-7xl mx-auto w-full"
    >
      {/* Image Gallery */}
      <div data-product className="flex-1 flex flex-col gap-4 opacity-0">
        <div className="relative aspect-[4/5] bg-[#f5f5f5] overflow-hidden">
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
                className="text-[#0a0a0a] text-6xl font-light opacity-10"
                style={{ fontFamily: "var(--font-display)" }}
              >
                MCWS
              </span>
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-16 h-20 bg-[#f5f5f5] overflow-hidden transition-all duration-200 ${
                  selectedImage === i
                    ? "ring-1 ring-[#8ecfb5]"
                    : "ring-1 ring-[#e5e7eb] hover:ring-[#d1d5db]"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                {img && !img.startsWith("/placeholder") ? (
                  <Image src={img} alt="" fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#f5f5f5]">
                    <span className="text-[#6b6b6b] text-xs" style={{ fontFamily: "var(--font-display)" }}>
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
            className="text-[#6b6b6b] text-[10px] tracking-[0.35em] uppercase mb-3"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            MCWS · Made to Order
          </p>
          <h1
            className="text-5xl md:text-6xl font-light leading-tight text-[#0a0a0a] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {p.name}
          </h1>
          <p
            className="text-3xl font-light text-[#0a0a0a] mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ${(p.price_cents / 100).toFixed(0)}
          </p>
        </div>

        <div data-product className="opacity-0 mb-8">
          <p
            className="text-[#6b6b6b] text-sm leading-7"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {p.description}
          </p>
        </div>

        <GeometricDivider className="mb-8" />

        {/* Size Selector */}
        <div data-product className="opacity-0 mb-6">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-[#6b6b6b] mb-4"
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
                    ? "bg-[#8ecfb5] text-white border border-[#8ecfb5]"
                    : "bg-white border border-[#8ecfb5] text-[#8ecfb5] hover:text-[#0a0a0a]"
                }`}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Selector */}
        <div data-product className="opacity-0 mb-10">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-[#6b6b6b] mb-4"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Quantity
          </p>
          <div className="flex items-center border border-[#e5e7eb] w-fit">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#f5f5f5] transition-colors text-base"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span
              className="w-9 h-9 flex items-center justify-center text-sm text-[#0a0a0a] border-x border-[#e5e7eb]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(5, q + 1))}
              className="w-9 h-9 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#f5f5f5] transition-colors text-base"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {error && (
          <p
            className="text-red-500 text-xs mb-4"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {error}
          </p>
        )}

        <div data-product className="opacity-0">
          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-white border border-[#8ecfb5] text-[#8ecfb5] text-xs tracking-[0.25em] uppercase hover:bg-[#8ecfb5] hover:text-white transition-colors duration-300"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {added ? "Added to Cart ✓" : "Add to Cart"}
          </button>

          <p
            className="text-[#6b6b6b] text-[10px] text-center mt-4 leading-5"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Secure checkout via Stripe. Made to order — ships within 2–3 weeks.
          </p>
        </div>
      </div>
    </section>
  );
}
