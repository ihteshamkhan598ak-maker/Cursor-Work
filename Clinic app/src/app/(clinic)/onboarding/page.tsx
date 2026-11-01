import { createClinic } from "./actions";

export const instant = false;

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { error } = await searchParams;
  return (
    <main className="mx-auto w-full max-w-lg px-4 py-12">
      <h1 className="mb-6 text-2xl font-bold">Set up your clinic</h1>
      <form
        action={createClinic}
        className="space-y-5 rounded-xl bg-white p-6 shadow-sm"
      >
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-red-700">
            {error}
          </p>
        )}
        <label className="block">
          Clinic name
          <input
            className="mt-2 min-h-11 w-full rounded-xl border px-3"
            name="name"
            maxLength={120}
            required
          />
        </label>
        <label className="block">
          City
          <input
            className="mt-2 min-h-11 w-full rounded-xl border bg-slate-100 px-3"
            value="Charsadda"
            disabled
          />
        </label>
        <label className="block">
          Clinic address
          <input
            className="mt-2 min-h-11 w-full rounded-xl border px-3"
            name="address"
            maxLength={300}
            required
          />
        </label>
        <label className="block">
          Clinic phone number
          <input
            className="mt-2 min-h-11 w-full rounded-xl border px-3"
            name="phone"
            placeholder="03XX-XXXXXXX"
            required
          />
        </label>
        <button
          className="min-h-11 w-full rounded-xl bg-teal-700 font-semibold text-white"
          type="submit"
        >
          Save clinic
        </button>
      </form>
    </main>
  );
}
