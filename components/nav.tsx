"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./logo";
import { useCart } from "./cart-context";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 bg-gradient-to-b from-black/30 to-transparent border-none">
      <Logo size="md" />
      <div className="flex items-center gap-8">
        <nav className="flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs tracking-[0.2em] uppercase transition-colors duration-200 text-white hover:text-white/60"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={openCart}
          aria-label="Open cart"
          className="relative text-xs tracking-[0.2em] uppercase text-white hover:text-white/60 transition-colors duration-200"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Cart
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-3 bg-white text-black text-[9px] font-medium rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
