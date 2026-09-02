"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isReg = mode === "register";
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isReg && values.password !== values.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!values.email?.includes("@")) {
      setError("Enter a valid email address");
      return;
    }
    if ((values.password || "").length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    const r = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!r.ok) {
      setError(
        r.status === 401
          ? "Invalid email or password"
          : (await r.text()) || "Something went wrong",
      );
      setLoading(false);
      return;
    }
    const data = await r.json();
    
    router.push("/onboarding");
  };
  const field = (id: string, label: string, type = "text") => (
    <label className="flex flex-col gap-2 text-sm font-medium" htmlFor={id}>
      {label}
      <input
        id={id}
        type={type}
        required
        className="auth-input"
        value={values[id] || ""}
        onChange={(e) => setValues({ ...values, [id]: e.target.value })}
      />
    </label>
  );
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {isReg && field("name", "Name")}
      {field("email", "Email", "email")}
      {field("password", "Password", "password")}
      {isReg && field("confirmPassword", "Confirm password", "password")}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <button
        disabled={loading}
        className="mt-2 min-h-12 rounded-full bg-primary px-5 text-base font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Working…" : isReg ? "Create account" : "Log in"}
      </button>
    </form>
  );
}
