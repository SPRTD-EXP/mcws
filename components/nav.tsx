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
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12 bg-white/95 backdrop-blur-sm border-b border-[#f0f0f0]">
      <Logo size="sm" />
      <div className="flex items-center gap-8">
        <nav className="flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs tracking-[0.2em] uppercase transition-colors duration-200 ${
                pathname === href
                  ? "text-[#0a0a0a]"
                  : "text-[#6b6b6b] hover:text-[#0a0a0a]"
              }`}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={openCart}
          aria-label="Open cart"
          className="relative text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors duration-200"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#8ecfb5] text-[#0a0a0a] text-[9px] font-medium rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
