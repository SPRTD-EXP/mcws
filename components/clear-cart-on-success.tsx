"use client";

import { useLayoutEffect } from "react";

export default function ClearCartOnSuccess() {
  useLayoutEffect(() => {
    try {
      localStorage.removeItem("mcws-cart");
    } catch {}
  }, []);

  return null;
}
