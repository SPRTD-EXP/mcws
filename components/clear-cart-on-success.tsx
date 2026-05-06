"use client";

import { useEffect } from "react";
import { useCart } from "./cart-context";

export default function ClearCartOnSuccess() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
