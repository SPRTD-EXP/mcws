import { NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

interface CartItem {
  productId: string;
  size: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  const { items } = await req.json() as { items: CartItem[] };

  if (!items?.length) {
    return Response.json({ error: "No items provided" }, { status: 400 });
  }

  const supabase = createServerSupabaseClient();
  const uniqueProductIds = [...new Set(items.map((i) => i.productId))];

  for (const productId of uniqueProductIds) {
    const { data: productRow } = await supabase
      .from("products")
      .select("stock")
      .eq("id", productId)
      .single();

    const stock = (productRow?.stock ?? {}) as Record<string, number>;
    for (const item of items.filter((i) => i.productId === productId)) {
      const available = stock[item.size] ?? 0;
      if (available < item.quantity) {
        return Response.json({ error: `Size ${item.size} is no longer in stock` }, { status: 409 });
      }
    }
  }

  return Response.json({ ok: true });
}
