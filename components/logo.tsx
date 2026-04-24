import Link from "next/link";

interface LogoProps {
  /** When a graphic SVG is ready, pass it here and the text wordmark is hidden */
  graphic?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  href?: string;
}

const sizeClasses = {
  sm: "text-xl tracking-[0.25em]",
  md: "text-2xl tracking-[0.3em]",
  lg: "text-4xl tracking-[0.35em]",
};

export default function Logo({ graphic, size = "md", href = "/" }: LogoProps) {
  const content = graphic ?? (
    <span
      className={`font-display font-light uppercase text-[#0a0a0a] ${sizeClasses[size]}`}
      style={{ fontFamily: "var(--font-display)" }}
    >
      MCWS
    </span>
  );

  return (
    <Link href={href} className="inline-flex items-center">
      {content}
    </Link>
  );
}
