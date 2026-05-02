"use client";

import { useState } from "react";
import LogoScrollBg from "./logo-scroll-bg";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="relative px-6 py-24 md:px-12 md:py-32 bg-[#111] overflow-hidden">
      <LogoScrollBg />
      <div className="relative z-10 max-w-xl mx-auto text-center">
        <h2
          className="text-4xl md:text-5xl font-light leading-tight mb-4 text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Stay in the Loop
        </h2>
        <p
          className="text-white text-sm leading-7 mb-10"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Be the first to know about new drops, restocks, and updates from MCWS.
        </p>

        {status === "success" ? (
          <p
            className="text-white text-sm tracking-[0.15em] uppercase"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            You&apos;re on the list.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="flex-1 bg-transparent border border-white/30 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white transition-colors duration-200"
              style={{ fontFamily: "var(--font-sans)" }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-8 py-3 text-xs tracking-[0.25em] uppercase border border-white text-white hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-50"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {status === "loading" ? "..." : "Notify Me"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p
            className="text-red-400 text-xs mt-3"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
