import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireClinic() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: clinic } = await supabase
    .from("clinics")
    .select("id, name, address, phone, city_id")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!clinic) redirect("/onboarding");
  return { supabase, user, clinic };
}
