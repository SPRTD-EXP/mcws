import Link from "next/link";
import GeometricDivider from "./geometric-divider";

// ▼ INSTAGRAM — paste your handle here (without the @)
const INSTAGRAM_HANDLE = "mcws_canton";
const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;

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
          <Link
            href="/contact"
            className="text-xs tracking-[0.2em] uppercase text-[#999] hover:text-white transition-colors duration-200"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Contact
          </Link>
          <Link
            href="/policies"
            className="text-xs tracking-[0.2em] uppercase text-[#999] hover:text-white transition-colors duration-200"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Policies
          </Link>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="MCWS on Instagram"
            className="text-[#999] hover:text-white transition-colors duration-200"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </nav>
      </div>
    </footer>
  );
}
