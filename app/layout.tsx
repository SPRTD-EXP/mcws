import type { Metadata } from "next";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart-context";
import CartDrawer from "@/components/cart-drawer";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "MCWS — Muslim Community of the Western Suburbs",
  description:
    "Represent your community. Official merch from the Muslim Community of the Western Suburbs of Detroit.",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/logo.ico", sizes: "any" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    title: "MCWS Merch",
    description: "Official merch from the Muslim Community of the Western Suburbs of Detroit.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cormorant.variable}>
      <body className="min-h-dvh flex flex-col antialiased"><CartProvider>
          <CartDrawer />
          {children}
        </CartProvider></body>
    </html>
  );
}
