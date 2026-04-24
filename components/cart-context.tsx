"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price_cents: number;
  stripePriceId: string;
  size: string;
  quantity: number;
  image?: string;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQty: (productId: string, size: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalCents: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mcws-cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("mcws-cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  function addItem(item: CartItem) {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.size === item.size
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }

  function removeItem(productId: string, size: string) {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );
  }

  function updateQty(productId: string, size: string, qty: number) {
    if (qty <= 0) {
      removeItem(productId, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size ? { ...i, quantity: qty } : i
      )
    );
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalCents = items.reduce((sum, i) => sum + i.price_cents * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQty,
        clearCart,
        itemCount,
        totalCents,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
