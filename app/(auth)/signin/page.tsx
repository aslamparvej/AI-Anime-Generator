// app/(auth)/signin/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
      callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8">
        <h1 className="text-2xl font-semibold text-text-white mb-6">
          Sign in
        </h1>

        {error && (
          <div className="mb-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-text-light mb-1">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="w-full rounded-lg bg-bg border border-border px-3 py-2 text-text-base outline-none focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-text-light mb-1">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              className="w-full rounded-lg bg-bg border border-border px-3 py-2 text-text-base outline-none focus:border-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl py-2.5 font-semibold text-text-white bg-gradient-to-r from-primary to-secondary hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-text-light">
          or
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="mt-3 w-full rounded-xl py-2.5 font-medium text-text-white bg-border hover:bg-border/80 transition"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-text-light">
          Don&apos;t have an account?{" "}
          <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
