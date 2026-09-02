import Link from "next/link";
import { AuthForm } from "./auth-form";
function Art({ register }: { register: boolean }) {
  return (
    <div className="auth-art relative hidden min-h-screen overflow-hidden bg-[#213183] p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="relative z-10 text-2xl font-semibold tracking-tight">
        JiraHub
      </div>
      <div className="relative z-10 max-w-md">
        <p className="mb-4 text-sm uppercase tracking-[.18em] text-[#aab6ff]">
          {register ? "Make space for good work" : "Welcome back"}
        </p>
        <h2 className="text-5xl font-bold leading-[1.02] tracking-[-.06em]">
          {register
            ? "A calmer way to move work forward."
            : "Your team’s work, all in one place."}
        </h2>
        <div className="float mt-12 rounded-2xl bg-[#62aef0] p-6 text-[#213183] shadow-2xl">
          <div className="mb-8 h-2 w-24 rounded-full bg-[#213183]/30" />
          <div className="flex gap-3">
            <span className="h-20 w-20 rounded-xl bg-[#ff64c8]" />
            <span className="h-20 w-20 rounded-xl bg-[#dd5b00]" />
            <span className="h-20 w-20 rounded-xl bg-[#1aae39]" />
          </div>
        </div>
      </div>
      <p className="relative z-10 text-sm text-white/60">
        Thoughtful tools for ambitious teams.
      </p>
    </div>
  );
}
export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const reg = mode === "register";
  return (
    <main className="flex min-h-screen">
      <section className="auth-form-pane flex w-full items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-16 block text-2xl font-semibold tracking-tight"
          >
            JiraHub
          </Link>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[.14em] text-muted-foreground">
            {reg ? "Get started" : "Sign in"}
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-[-.05em]">
            {reg ? "Create your account" : "Good to see you again."}
          </h1>
          <p className="mt-3 mb-8 leading-6 text-muted-foreground">
            {reg
              ? "Bring your team’s best work together."
              : "Pick up where you left off."}
          </p>
          <AuthForm mode={mode} />
          <p className="mt-8 text-center text-sm text-muted-foreground">
            {reg ? "Already have an account?" : "Don’t have an account?"}{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href={reg ? "/auth/login" : "/auth/register"}
            >
              {reg ? "Log in" : "Sign up"}
            </Link>
          </p>
        </div>
      </section>
      <Art register={reg} />
    </main>
  );
}
