"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authSchema } from "@/lib/validations/auth";

function authValues(formData: FormData) {
  return authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
}

export async function login(formData: FormData) {
  const values = authValues(formData);
  if (!values.success) redirect("/login?error=Invalid+email+or+password");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(values.data);
  if (error) redirect("/login?error=Invalid+email+or+password");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const values = authValues(formData);
  if (!values.success) {
    const message =
      values.error.issues[0]?.message ?? "The account information is invalid.";
    redirect(`/signup?error=${encodeURIComponent(message)}`);
  }
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp(values.data);
  if (error) {
    const messages: Record<string, string> = {
      email_address_invalid: "Enter a valid email address.",
      email_exists: "An account already exists for this email.",
      user_already_exists: "An account already exists for this email.",
      weak_password: "Use a stronger password containing letters and numbers.",
      over_email_send_rate_limit:
        "Too many requests. Please try again in a few minutes.",
      signup_disabled: "New account registration is currently unavailable.",
    };
    const message =
      messages[error.code ?? ""] ??
      "The account could not be created. Check your email and password, then try again.";
    redirect(`/signup?error=${encodeURIComponent(message)}`);
  }
  if (data.session) redirect("/onboarding");
  redirect("/login?message=Check+your+email+to+verify+your+account");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
