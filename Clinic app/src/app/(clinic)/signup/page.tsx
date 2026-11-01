import { AuthForm } from "@/components/auth-form";
import { signup } from "../auth-actions";

export const instant = false;

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="mb-2 text-2xl font-bold">Create a clinic account</h1>
      <p className="mb-6 text-slate-600">Create one account for each clinic.</p>
      <AuthForm
        action={signup}
        submitLabel="Create account"
        alternateHref="/login"
        alternateLabel="Already have an account? Log in"
        message={
          query.error ? (
            <p
              role="alert"
              className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {query.error}
            </p>
          ) : undefined
        }
      />
    </main>
  );
}
