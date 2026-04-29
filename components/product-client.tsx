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
  fallbackStripePriceId?: string;
}

const SUPABASE_URL = "https://rodxyfopdfwtaxrrirsg.supabase.co";
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/products/hoodie`;

const FALLBACK_IMAGES = [
  `${STORAGE_BASE}/1.JPG`,
  `${STORAGE_BASE}/2.JPG`,
  `${STORAGE_BASE}/3.jpg`,
  `${STORAGE_BASE}/4.jpg`,
];

const FALLBACK_PRODUCT: Product = {
  id: "775f6f07-2531-4fff-9997-0dc0b578cc4c",
  name: "HOODIE",
  description:
    "A premium heavyweight hoodie representing the Muslim Community of the Western Suburbs of Detroit. Embroidered MCWS logo. Made to order.",
  price_cents: 6500,
  stripe_price_id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ?? null,
  sizes: ["S", "M", "L", "XL"],
  images: FALLBACK_IMAGES,
};

export default function ProductClient({ product, fallbackStripePriceId = "" }: ProductClientProps) {
  const p = product ?? FALLBACK_PRODUCT;
  const images = p.images.length > 0 ? p.images : FALLBACK_IMAGES;
  const stripePriceId = p.stripe_price_id ?? fallbackStripePriceId;

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
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
      stripePriceId,
      size: selectedSize,
      quantity: 1,
      image: images[0],
    });
    openCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <section
      ref={sectionRef}
      className="flex flex-col lg:flex-row lg:items-stretch gap-16 px-6 py-16 md:px-12 max-w-7xl mx-auto w-full"
    >
      {/* Image Gallery */}
      <div data-product className="flex-1 flex flex-col gap-4 opacity-0 lg:self-stretch">
        <div className="relative flex-1 min-h-[400px] bg-[#111] overflow-hidden">
          {images[selectedImage] && !images[selectedImage].startsWith("/placeholder") ? (
            <Image
              src={images[selectedImage]}
              alt={`${p.name} — view ${selectedImage + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={selectedImage === 0}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center pattern-overlay">
              <span
                className="text-white text-6xl font-light opacity-10"
                style={{ fontFamily: "var(--font-display)" }}
              >
                MCWS
              </span>
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 justify-center">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-16 h-20 bg-[#111] overflow-hidden transition-all duration-200 ${
                  selectedImage === i
                    ? "ring-1 ring-white"
                    : "ring-1 ring-white/10 hover:ring-white/30"
                }`}
                aria-label={`View image ${i + 1}`}
              >
                {img && !img.startsWith("/placeholder") ? (
                  <Image src={img} alt="" fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#111]">
                    <span className="text-white/40 text-xs" style={{ fontFamily: "var(--font-display)" }}>
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
          <h1
            className="text-5xl md:text-6xl font-light leading-tight text-white mb-4 tracking-widest"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {p.name}
          </h1>
          <p
            className="text-3xl font-light text-white mb-6"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            ${(p.price_cents / 100).toFixed(0)}
          </p>
        </div>

        <div data-product className="opacity-0 mb-8">
          <p
            className="text-white/60 text-sm leading-7"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {p.description}
          </p>
        </div>

        <GeometricDivider className="mb-8" />

        {/* Size dropdown */}
        <div data-product className="opacity-0 mb-10 flex flex-col gap-3">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-white/40"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Size
          </p>
          <select
            value={selectedSize ?? ""}
            onChange={(e) => setSelectedSize(e.target.value || null)}
            className="w-full bg-transparent border border-white text-white text-xs tracking-[0.15em] uppercase px-4 py-3 outline-none focus:border-white transition-colors duration-200 appearance-none cursor-pointer"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <option value="" disabled className="bg-black">— Size —</option>
            {p.sizes.map((size) => (
              <option key={size} value={size} className="bg-black">{size}</option>
            ))}
          </select>
        </div>

        {error && (
          <p
            className="text-red-400 text-xs mb-4"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {error}
          </p>
        )}

        <div data-product className="opacity-0">
          <button
            onClick={handleAddToCart}
            className="w-full py-4 border border-white text-white text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-colors duration-300"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {added ? "Added to Cart ✓" : "Add to Cart"}
          </button>

          <p
            className="text-white/40 text-[10px] text-center mt-4 leading-5"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Secure checkout via Stripe. Made to order — ships within 2–3 weeks.
          </p>
        </div>
      </div>
    </section>
  );
}
