"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./logo";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-12">
      <Logo size="sm" />
      <nav className="flex items-center gap-8">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-xs tracking-[0.2em] uppercase transition-colors duration-200 ${
              pathname === href
                ? "text-white"
                : "text-[#999] hover:text-white"
            }`}
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
