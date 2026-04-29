"use client";

import { useState, useTransition } from "react";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import GeometricDivider from "@/components/geometric-divider";
import { submitContactForm } from "./actions";

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitContactForm(formData);
      setResult(res);
      if (res.success) {
        (e.target as HTMLFormElement).reset();
      }
    });
  }

  return (
    <>
      <Nav />
      <main className="flex flex-col flex-1 pt-28 pb-16 px-6 md:px-12">
        <div className="max-w-xl mx-auto w-full">
          <div className="mb-12">
            <p
              className="text-white text-[10px] tracking-[0.4em] uppercase mb-4"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Get in Touch
            </p>
            <h1
              className="text-5xl md:text-6xl font-light leading-tight text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Contact Us
            </h1>
            <p
              className="text-white/60 text-sm leading-7 mt-4"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Questions about your order or anything else — we&apos;re here.
            </p>
          </div>

          <GeometricDivider className="mb-10" />

          {result?.success ? (
            <div className="py-12 text-center">
              <p
                className="text-white text-[10px] tracking-[0.4em] uppercase mb-4"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Message Sent
              </p>
              <p
                className="text-white text-lg font-light"
                style={{ fontFamily: "var(--font-display)" }}
              >
                JazakAllahu Khayran — we&apos;ll be in touch soon.
              </p>
              <button
                onClick={() => setResult(null)}
                className="mt-8 text-xs tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors duration-200"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-[10px] tracking-[0.25em] uppercase text-white mb-2"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className="w-full bg-white/5 border border-white/20 text-white text-sm px-4 py-3 outline-none focus:border-white focus:ring-1 focus:ring-white/30 transition-colors duration-200 placeholder:text-white/20"
                  style={{ fontFamily: "var(--font-sans)" }}
                  placeholder="Your name"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-[10px] tracking-[0.25em] uppercase text-white mb-2"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full bg-white/5 border border-white/20 text-white text-sm px-4 py-3 outline-none focus:border-white focus:ring-1 focus:ring-white/30 transition-colors duration-200 placeholder:text-white/20"
                  style={{ fontFamily: "var(--font-sans)" }}
                  placeholder="you@example.com"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-[10px] tracking-[0.25em] uppercase text-white mb-2"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="w-full bg-white/5 border border-white/20 text-white text-sm px-4 py-3 outline-none focus:border-white focus:ring-1 focus:ring-white/30 transition-colors duration-200 placeholder:text-white/20 resize-none"
                  style={{ fontFamily: "var(--font-sans)" }}
                  placeholder="How can we help?"
                  suppressHydrationWarning
                />
              </div>

              {result?.error && (
                <p
                  className="text-red-400 text-xs"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {result.error}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="w-full px-8 py-3.5 text-xs tracking-[0.25em] uppercase border border-white text-white hover:border-white/60 hover:text-white/60 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {isPending ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
