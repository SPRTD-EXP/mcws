"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "./cart-context";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: string;
  name: string;
  description: string;
  stripe_price_id: string | null;
  sizes: string[];
  stock: Record<string, number>;
  images: string[];
}

interface ProductClientProps {
  product: Product;
  priceCents: number;
  stripePriceId: string;
}

export default function ProductClient({ product, priceCents, stripePriceId }: ProductClientProps) {
  const p = product;
  const images = p.images;

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
    if ((p.stock[selectedSize] ?? 0) < 1) {
      setError("That size is out of stock.");
      return;
    }
    setError(null);
    addItem({
      productId: p.id,
      name: p.name,
      price_cents: priceCents,
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
      className="flex flex-col lg:flex-row lg:items-stretch gap-0 w-full"
    >
      {/* Image Gallery */}
      <div data-product className="lg:w-1/2 flex flex-col items-center justify-center gap-4 opacity-0 px-12 py-16">
        <div className="relative w-full max-w-lg min-h-[400px] overflow-hidden">
          {images[selectedImage] && !images[selectedImage].startsWith("/placeholder") ? (
            <Image
              src={images[selectedImage]}
              alt={`${p.name} — view ${selectedImage + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain"
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
                  <Image src={img} alt="" fill sizes="64px" className="object-cover" />
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

      {/* Vertical divider — desktop only */}
      <div className="hidden lg:block w-px bg-white/10 self-stretch flex-none" />

      {/* Product Details */}
      <div className="lg:w-1/2 flex flex-col items-center justify-center px-12 py-16 text-center">
        <div className="w-full max-w-sm">

        {/* Name + price + description */}
        <div data-product className="opacity-0 mb-8">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-white font-bold mb-4"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {p.name}
          </p>
          <p
            className="text-2xl font-light text-white mb-6"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            ${(priceCents / 100).toFixed(0)}
          </p>
          <p
            className="text-white text-sm leading-7 whitespace-pre-line"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {p.description}
          </p>
        </div>

        {/* Divider */}
        <hr className="border-white/10 mb-8" />

        {/* Size */}
        <div data-product className="opacity-0 mb-3">
          <p
            className="text-[10px] tracking-[0.3em] uppercase text-white"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Size
          </p>
        </div>
        <div data-product className="opacity-0 mb-8">
          <select
            value={selectedSize ?? ""}
            onChange={(e) => setSelectedSize(e.target.value || null)}
            className="w-full bg-transparent border border-white/20 text-white text-xs tracking-[0.15em] uppercase px-4 py-3 outline-none focus:border-white transition-colors duration-200 appearance-none cursor-pointer text-center"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            <option value="" disabled className="bg-black">— Select Size —</option>
            {p.sizes.map((size) => {
              const available = p.stock[size] ?? 0;
              return (
                <option key={size} value={size} disabled={available === 0} className="bg-black">
                  {available === 0 ? `${size} — Out of Stock` : size}
                </option>
              );
            })}
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
          <p
            className="text-white text-[10px] text-center mb-4 leading-5"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Ships within 2–3 days.
          </p>
          <button
            onClick={handleAddToCart}
            className="w-full py-4 border border-white text-white text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-colors duration-300"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {added ? "Added to Cart" : "Add to Cart"}
          </button>
        </div>
        </div>
      </div>
    </section>
  );
}
