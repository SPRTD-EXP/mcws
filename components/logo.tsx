import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
}

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 64,
};

export default function Logo({ size = "md", href = "/" }: LogoProps) {
  const px = sizeMap[size];
  return (
    <Link href={href} className="inline-flex items-center">
      <Image src="/logo.svg" alt="MCWS" width={px} height={px} priority style={{ filter: "brightness(0) invert(1)" }} />
    </Link>
  );
}
