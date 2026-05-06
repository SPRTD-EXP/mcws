"use client";

import { useEffect, useLayoutEffect } from "react";
import { useCart } from "./cart-context";

export default function ClearCartOnSuccess() {
  // useLayoutEffect fires synchronously before any useEffect runs.
  // Wiping localStorage here means CartProvider's load effect reads nothing.
  useLayoutEffect(() => {
    try {
      localStorage.removeItem("mcws-cart");
    } catch {}
  }, []);

  // Also clear React state for client-side navigations where CartProvider
  // is already mounted and won't re-run its load effect.
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
