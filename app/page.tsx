import Link from "next/link";
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <div className="text-2xl font-semibold tracking-tight">JiraHub</div>
        <Link
          href="/auth/login"
          className="rounded-full border px-4 py-2 text-sm font-medium"
        >
          Log in
        </Link>
      </header>
      <section className="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-[.16em] text-primary">
          Work, in one place
        </p>
        <h1 className="mt-5 text-balance text-5xl font-bold tracking-[-.07em] sm:text-7xl">
          Make room for your best work.
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">
          A calm, connected workspace for teams who want to plan less and make
          more.
        </p>
        <Link
          href="/auth/register"
          className="mt-10 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground"
        >
          Create your account
        </Link>
      </section>
    </main>
  );
}
