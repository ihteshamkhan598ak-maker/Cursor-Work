import { AuthForm } from "@/components/auth-form";
import { login } from "../auth-actions";

export const instant = false;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">Clinic login</h1>
      <AuthForm
        action={login}
        submitLabel="Log in"
        alternateHref="/signup"
        alternateLabel="Create a clinic account"
        message={
          <>
            {query.error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {query.error}
              </p>
            )}
            {query.message && (
              <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
                {query.message}
              </p>
            )}
          </>
        }
      />
    </main>
  );
}
