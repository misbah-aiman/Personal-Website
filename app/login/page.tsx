"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiLock, FiArrowRight, FiAlertCircle } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Login failed");
      }
      router.push(next);
      router.refresh();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-background p-6">
      <div className="absolute inset-0 -z-10 bg-grid-pattern bg-[size:48px_48px] opacity-50 dark:opacity-100" />
      <div className="absolute -top-32 -left-32 -z-10 h-[420px] w-[420px] rounded-full bg-accent/25 blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 -z-10 h-[420px] w-[420px] rounded-full bg-accent2/20 blur-[120px]" />

      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-surface/70 p-8 backdrop-blur-xl"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent2 text-white shadow-xl shadow-accent/30">
            <FiLock size={22} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold">Admin login</h1>
          <p className="mt-1 text-sm text-muted">
            Owner-only access to manage site content.
          </p>
        </div>

        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted">
          Password
        </label>
        <input
          type="password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl border border-border bg-background p-3.5 text-sm outline-none transition focus:border-accent"
        />

        {err && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-500">
            <FiAlertCircle size={14} /> {err}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent2 px-5 py-3 text-sm font-medium text-white shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
          <FiArrowRight />
        </button>

        <p className="mt-4 text-center text-[11px] text-muted">
          Set <code className="font-mono">ADMIN_PASSWORD</code> in{" "}
          <code className="font-mono">.env.local</code> to change credentials.
        </p>
      </form>
    </div>
  );
}
