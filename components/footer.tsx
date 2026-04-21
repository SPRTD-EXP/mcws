import Link from "next/link";
import GeometricDivider from "./geometric-divider";

export default function Footer() {
  return (
    <footer className="mt-auto px-6 py-12 md:px-12">
      <GeometricDivider className="mb-10" />
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <span
          className="text-xs tracking-[0.25em] uppercase text-[#999]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Muslim Community of the Western Suburbs of Detroit
        </span>
        <nav className="flex items-center gap-6">
          {[
            { href: "/shop", label: "Shop" },
            { href: "/about", label: "About" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-xs tracking-[0.2em] uppercase text-[#999] hover:text-white transition-colors duration-200"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
