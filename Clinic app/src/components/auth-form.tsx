import Link from "next/link";
import type { ReactNode } from "react";

type AuthFormProps = {
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  alternateHref: string;
  alternateLabel: string;
  message?: ReactNode;
};

export function AuthForm({
  action,
  submitLabel,
  alternateHref,
  alternateLabel,
  message,
}: AuthFormProps) {
  return (
    <form
      action={action}
      className="space-y-5 rounded-xl bg-white p-6 shadow-sm"
    >
      {message}
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="email">
          Email address
        </label>
        <input
          className="min-h-11 w-full rounded-xl border border-slate-300 px-3 focus:ring-2 focus:ring-teal-700"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="password">
          Password
        </label>
        <input
          className="min-h-11 w-full rounded-xl border border-slate-300 px-3 focus:ring-2 focus:ring-teal-700"
          id="password"
          name="password"
          type="password"
          minLength={8}
          maxLength={72}
          autoComplete="current-password"
          required
        />
      </div>
      <button
        className="min-h-11 w-full rounded-xl bg-teal-700 px-4 font-semibold text-white hover:bg-teal-800"
        type="submit"
      >
        {submitLabel}
      </button>
      <Link
        className="block text-center text-sm text-teal-700 underline"
        href={alternateHref}
      >
        {alternateLabel}
      </Link>
    </form>
  );
}
