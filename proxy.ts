import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const accessToken =
    request.cookies.get("accessToken")?.value;

  const isAuthPage =
    path === "/auth/login" ||
    path === "/auth/register";

  const isHomePage = path === "/";

  /*
   * Logged-in user visiting login/register/home
   */
  if (
    accessToken &&
    (isAuthPage || isHomePage)
  ) {
    return NextResponse.redirect(
      new URL("/onboarding", request.url)
    );
  }

  /*
   * Protected routes without access token
   */
  if (
    !accessToken &&
    !isAuthPage &&
    !isHomePage
  ) {
    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
      "/auth/:path*",
  ],
};