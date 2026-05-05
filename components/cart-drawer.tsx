"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "./cart-context";

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQty,
    totalCents,
  } = useCart();

  function handleCheckout() {
    closeCart();
    router.push("/checkout");
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-[60] h-full w-80 bg-[#111] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <span
            className="text-[10px] tracking-[0.3em] uppercase text-white"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Cart
          </span>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-white/40 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <p className="text-sm text-white" style={{ fontFamily: "var(--font-sans)" }}>
                Your cart is empty.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="block w-full py-4 border border-white text-white text-xs tracking-[0.25em] uppercase text-center hover:bg-white hover:text-black transition-colors duration-200"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-white/10">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}`} className="py-4 flex items-center gap-3">
                  <span
                    className="text-sm font-medium text-white leading-tight flex-shrink-0"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {item.name}
                  </span>
                  <span
                    className="text-sm font-medium text-white flex-shrink-0"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {item.size}
                  </span>
                  <div className="flex items-center border border-white/20 ml-auto flex-shrink-0">
                      <button
                        onClick={() => updateQty(item.productId, item.size, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors text-sm"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span
                        className="w-7 h-7 flex items-center justify-center text-xs text-white border-x border-white/20"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, item.size, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors text-sm"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  <span
                    className="text-sm text-white flex-shrink-0"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    ${((item.price_cents * item.quantity) / 100).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId, item.size)}
                    aria-label={`Remove ${item.name} size ${item.size}`}
                    className="text-white/20 hover:text-white transition-colors flex-shrink-0"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/10 px-5 py-5 space-y-4">
            <div className="flex justify-between text-sm font-medium text-white">
              <span style={{ fontFamily: "var(--font-sans)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-sans)" }}>
                ${(totalCents / 100).toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 border border-white text-white text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-colors duration-200"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
