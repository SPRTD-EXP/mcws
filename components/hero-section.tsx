"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.75;
  }, []);

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
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="/hero.mp4"
      />

      {/* Dark overlay for legibility */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* Label pinned just below the navbar */}
      <p
        data-hero
        className="absolute top-[72px] left-0 right-0 z-10 text-center text-[#8ecfb5] text-[10px] tracking-[0.4em] uppercase opacity-0 py-3"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        Muslim Community of the Western Suburbs · Detroit
      </p>

      <div className="relative z-10 flex flex-col items-center gap-7 max-w-3xl">
        <h1
          data-hero
          className="text-[clamp(4rem,14vw,10rem)] font-light leading-none tracking-[0.15em] uppercase text-white opacity-0"
          style={{ fontFamily: "var(--font-display)" }}
        >
          MCWS
        </h1>

        <div data-hero className="w-full opacity-0">
          <Link
            href="/shop"
            className="flex items-center justify-center w-full py-3 text-xs tracking-[0.25em] uppercase border border-white text-white hover:border-[#8ecfb5] hover:text-[#8ecfb5] transition-colors duration-300"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Wear Your Identity
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-hero
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <span
          className="text-[9px] tracking-[0.3em] uppercase text-[#8ecfb5]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-[#8ecfb5] to-transparent" />
      </div>
    </section>
  );
}
