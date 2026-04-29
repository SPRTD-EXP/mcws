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
        className="absolute top-[72px] left-0 right-0 z-10 text-center text-white text-[10px] tracking-[0.4em] uppercase opacity-0 py-3"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        Muslim Community of the Western Suburbs · Detroit
      </p>

      {/* Button + scroll indicator pinned to bottom */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
      >
        <Link
          data-hero
          href="/shop"
          className="opacity-0 px-12 py-3 text-xs tracking-[0.25em] uppercase border border-white text-white hover:border-white/60 hover:text-white/60 transition-colors duration-300"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Shop Now
        </Link>
        <div data-hero className="flex flex-col items-center gap-2 opacity-0">
          <span
            className="text-[9px] tracking-[0.3em] uppercase text-white"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}
