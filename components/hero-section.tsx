"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-dvh px-6 text-center overflow-hidden"
    >
      {/* Subtle geometric pattern */}
      <div className="absolute inset-0 pattern-overlay opacity-60 pointer-events-none" />

      {/* Radial gradient fade — softens the pattern toward center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, #000 80%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-7 max-w-3xl">
        <p
          data-hero
          className="text-[#999] text-[10px] tracking-[0.4em] uppercase opacity-0"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Muslim Community of the Western Suburbs · Detroit
        </p>

        <h1
          data-hero
          className="text-[clamp(4rem,14vw,10rem)] font-light leading-none tracking-[0.15em] uppercase text-white opacity-0"
          style={{ fontFamily: "var(--font-display)" }}
        >
          MCWS
        </h1>

        <p
          data-hero
          className="text-xl md:text-2xl font-light italic text-[#8ecfb5] opacity-0"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Wear your identity.
        </p>

        <p
          data-hero
          className="text-[#999] text-sm leading-relaxed max-w-md opacity-0"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          One hoodie. One community. Made to order.
        </p>

        <div data-hero className="flex items-center gap-5 opacity-0">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 px-8 py-3.5 text-xs tracking-[0.25em] uppercase bg-[#8ecfb5] text-black hover:bg-white transition-colors duration-300"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Shop the Collection
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-hero
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <span
          className="text-[9px] tracking-[0.3em] uppercase text-[#555]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-[#555] to-transparent" />
      </div>
    </section>
  );
}
