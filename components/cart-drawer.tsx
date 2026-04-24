"use client";

import { useRouter } from "next/navigation";
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
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-80 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e5e7eb]">
          <span
            className="text-[10px] tracking-[0.3em] uppercase text-[#0a0a0a]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Your Cart
          </span>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors"
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
            <div className="flex flex-col items-center justify-center h-full gap-4 text-[#6b6b6b]">
              <p className="text-sm" style={{ fontFamily: "var(--font-sans)" }}>
                Your cart is empty.
              </p>
              <button
                onClick={closeCart}
                className="text-xs tracking-[0.15em] uppercase underline underline-offset-4 hover:text-[#0a0a0a] transition-colors"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[#e5e7eb]">
              {items.map((item) => (
                <li key={`${item.productId}-${item.size}`} className="py-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1">
                      <span
                        className="text-sm font-medium text-[#0a0a0a] leading-tight"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {item.name}
                      </span>
                      <span
                        className="text-[9px] tracking-[0.2em] uppercase bg-[#f5f5f5] text-[#6b6b6b] px-2 py-0.5 w-fit"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        Size {item.size}
                      </span>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      aria-label={`Remove ${item.name} size ${item.size}`}
                      className="text-[#bbb] hover:text-[#0a0a0a] transition-colors flex-shrink-0 mt-0.5"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-[#e5e7eb]">
                      <button
                        onClick={() => updateQty(item.productId, item.size, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#f5f5f5] transition-colors text-sm"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span
                        className="w-7 h-7 flex items-center justify-center text-xs text-[#0a0a0a] border-x border-[#e5e7eb]"
                        style={{ fontFamily: "var(--font-sans)" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, item.size, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#f5f5f5] transition-colors text-sm"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span
                      className="text-sm text-[#0a0a0a]"
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      ${((item.price_cents * item.quantity) / 100).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#e5e7eb] px-5 py-5 space-y-4">
            <div className="flex justify-between text-sm font-medium text-[#0a0a0a]">
              <span style={{ fontFamily: "var(--font-sans)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-sans)" }}>
                ${(totalCents / 100).toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-white border border-[#8ecfb5] text-[#8ecfb5] text-xs tracking-[0.25em] uppercase hover:bg-[#8ecfb5] hover:text-white transition-colors duration-200"
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
