import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { getCurrentUser } from "@/lib/auth/server";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user) {
    return <>{children}</>;
  }

  /*
   * No valid access token.
   *
   * Check whether we have a refresh token.
   */
  const cookieStore = await cookies();

  const refreshToken =
    cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    redirect("/auth/login");
  }

  /*
   * We have a refresh token.
   *
   * Send the user through the refresh boundary.
   */
  redirect(
    `/auth/refresh?redirect=${encodeURIComponent("/")}`
  );
}