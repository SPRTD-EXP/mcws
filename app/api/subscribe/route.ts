import { NextRequest } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return new Response("Invalid email", { status: 400 });
  }

  const supabase = createServiceSupabaseClient();
  const { error } = await supabase
    .from("subscribers")
    .insert({ email: email.toLowerCase().trim() });

  if (error) {
    if (error.code === "23505") {
      return new Response("Already subscribed", { status: 200 });
    }
    return new Response("Failed to subscribe", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
