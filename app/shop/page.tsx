export const dynamic = "force-dynamic";

import Nav from "@/components/nav";
import Footer from "@/components/footer";
import ProductClient from "@/components/product-client";
import { createServerSupabaseClient } from "@/lib/supabase";

async function getProduct() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .single();
  return data;
}

export default async function ShopPage() {
  const product = await getProduct();

  return (
    <>
      <Nav />
      <main className="flex flex-col flex-1 pt-24">
        <ProductClient product={product} />
      </main>
      <Footer />
    </>
  );
}
