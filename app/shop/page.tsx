export const dynamic = "force-dynamic";

import Nav from "@/components/nav";
import Footer from "@/components/footer";
import ProductClient from "@/components/product-client";
import { createServerSupabaseClient } from "@/lib/supabase";

async function getProduct() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();
  if (error) console.error("[shop] Supabase error:", error.message, error.code);
  return data;
}

export default async function ShopPage() {
  const product = await getProduct();
  // Server-side fallback: used when Supabase doesn't load the product
  const fallbackStripePriceId = process.env.STRIPE_PRICE_ID ?? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID ?? "";

  return (
    <>
      <Nav />
      <main className="flex flex-col flex-1 pt-24">
        <ProductClient product={product} fallbackStripePriceId={fallbackStripePriceId} />
      </main>
      <Footer />
    </>
  );
}
