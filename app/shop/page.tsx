export const dynamic = "force-dynamic";

import Nav from "@/components/nav";
import Footer from "@/components/footer";
import ProductClient from "@/components/product-client";
import { createServerSupabaseClient } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";

async function getProduct() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();
  if (error) throw new Error(`Failed to load product: ${error.message}`);
  if (!data) throw new Error("No active product found.");
  return data;
}

async function getStripePriceCents(priceId: string): Promise<number> {
  const price = await getStripe().prices.retrieve(priceId);
  return price.unit_amount ?? 0;
}

export default async function ShopPage() {
  const product = await getProduct();
  const fallbackPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ?? "";

  let stripePriceId = product.stripe_price_id ?? fallbackPriceId;
  let priceCents = 0;

  if (stripePriceId) {
    try {
      priceCents = await getStripePriceCents(stripePriceId);
    } catch {
      // Live price ID rejected by test keys — fall back to env var
      if (fallbackPriceId && fallbackPriceId !== stripePriceId) {
        stripePriceId = fallbackPriceId;
        priceCents = await getStripePriceCents(fallbackPriceId);
      }
    }
  }

  return (
    <>
      <Nav />
      <main className="flex flex-col flex-1 pt-24 pb-16 lg:pb-0">
        <ProductClient product={product} priceCents={priceCents} stripePriceId={stripePriceId} />
      </main>
      <Footer />
    </>
  );
}
