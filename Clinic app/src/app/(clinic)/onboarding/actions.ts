"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { clinicProfileSchema } from "@/lib/validations/auth";

export async function createClinic(formData: FormData) {
  const values = clinicProfileSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    phone: formData.get("phone"),
  });
  if (!values.success)
    redirect(
      `/onboarding?error=${encodeURIComponent(values.error.issues[0]?.message ?? "The clinic information is invalid.")}`,
    );
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: city } = await supabase
    .from("cities")
    .select("id")
    .eq("slug", "charsadda")
    .single();
  if (!city)
    redirect("/onboarding?error=Charsadda+is+not+available+in+the+system");
  const { error } = await supabase
    .from("clinics")
    .insert({ ...values.data, owner_id: user.id, city_id: city.id });
  if (error) redirect("/onboarding?error=Unable+to+save+the+clinic");
  redirect("/dashboard");
}
