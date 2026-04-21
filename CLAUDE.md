# MCWS — Merch Store

Single-product e-commerce site for Muslim Community of the Western Suburbs of Detroit. Sells one branded hoodie (S–XL) with shipping and local pickup options. The site represents MCWS only — no reference to the manufacturer or any third party.

## Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (minimal usage, custom styled)
- **Database**: Supabase (Postgres)
- **Payments**: Stripe Checkout (hosted checkout page, webhook for order creation)
- **Notifications**: Resend (email to manufacturer on each new order)
- **Shipping**: Shippo (Phase 1: manufacturer uses Shippo dashboard directly, tracking entered manually)
- **Animations**: GSAP (page load transitions, subtle scroll-triggered effects only)
- **Deployment**: Vercel

## Commands

```bash
pnpm dev          # Start Next.js dev server
pnpm build        # Production build
pnpm lint         # ESLint
```

## Design System

- **Palette**: Black (#000) background, white (#FFF) text, mint (#8ECFB5) accents. Secondary bg (#111). Muted text (#999). Borders (#333).
- **Typography**: Cormorant Garamond for display headings (luxury serif — weights 300/400/600, including italics). Inter for body, UI, and captions. Weight variation creates hierarchy. No other fonts.
- **Logo**: "MCWS" wordmark rendered in Cormorant Garamond via a `<Logo>` component. Built to swap in an SVG graphic logo later without touching other files. Never use original gold/teal colors — white on black only.
- **Tone**: Luxurious and considered — like a premium brand — while remaining warm and community-centered, appropriate for a religious organization. Dignified restraint. No cold minimalism, no flashy excess.
- **Islamic accents**: A subtle Islamic geometric star/tessellation motif used as section texture or divider element. Very low opacity (3–5%), purely decorative, adds cultural depth without dominating.
- **Animations**: Restrained. GSAP `power2.out` easing. No bounce, no elastic. Load-in stagger on hero elements, subtle opacity/translate on scroll, micro-interactions on hover.

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing — hero with CTA to shop, community identity teaser, footer |
| `/shop` | Product page — image gallery, size selector, fulfillment toggle, Buy Now |
| `/about` | MCWS community story and mission |
| `/order/[id]` | Post-checkout order confirmation |
| `/api/checkout` | Creates Stripe Checkout Session |
| `/api/webhooks/stripe` | Handles `checkout.session.completed`, writes order to Supabase, emails manufacturer |

## Database Schema (Supabase)

### products
`id` (uuid PK), `name` (text), `description` (text), `price_cents` (int), `sizes` (text[]), `images` (text[]), `is_active` (bool), `created_at` (timestamptz)

### orders
`id` (uuid PK), `product_id` (uuid FK), `size` (text), `quantity` (int), `customer_name` (text), `customer_email` (text), `customer_phone` (text nullable), `fulfillment_method` ("shipping" | "pickup"), `shipping_address` (jsonb nullable), `stripe_session_id` (text), `stripe_payment_intent` (text), `payment_status` (text), `fulfillment_status` ("pending" → "producing" → "shipped"/"ready_for_pickup" → "completed"), `tracking_number` (text nullable), `tracking_url` (text nullable), `notes` (text nullable), `created_at` (timestamptz), `updated_at` (timestamptz)

## Checkout Flow

1. Customer selects size + fulfillment method on `/shop`
2. Click Buy Now → hits `/api/checkout` → creates Stripe Checkout Session
3. Stripe collects payment + shipping address (if shipping)
4. `checkout.session.completed` webhook fires → `/api/webhooks/stripe`
5. Webhook verifies Stripe signature, creates order in Supabase
6. Sends email notification to manufacturer via Resend
7. Customer redirected to `/order/[id]` confirmation page

Pickup orders skip shipping address collection. Confirmation page shows mosque address and pickup instructions.

## Key Patterns

- **No cart**: Single product = direct to Stripe Checkout. No cart state needed.
- **No customer accounts**: No login, no order history for buyers.
- **Product images**: Stored in Supabase Storage (public bucket), referenced by URL in `products.images` array. Use Next.js `<Image>` for optimization.
- **Stripe webhook**: Verify signature with `STRIPE_WEBHOOK_SECRET`. Pass `fulfillment_method`, `size`, and `product_id` as Checkout Session metadata.
- **Manufacturer notifications**: Email via Resend, triggered from webhook handler. Include product, size, customer name, fulfillment method, and shipping address if applicable. Recipient address stored in `MANUFACTURER_EMAIL` env var.
- **Logo component**: `src/components/logo.tsx` — renders text wordmark by default, accepts SVG swap later.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
RESEND_API_KEY
MANUFACTURER_EMAIL
```

## Out of Scope

Shopping cart, customer accounts, multiple products, discount codes, inventory tracking, Shippo API integration (Phase 2), analytics dashboard, admin order management panel. Do not build these.
