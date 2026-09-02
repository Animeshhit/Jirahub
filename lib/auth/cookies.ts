import type { NextResponse } from "next/server";

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";

export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 15 * 60,
};

export function setAccessTokenCookie(
  response: NextResponse,
  accessToken: string
) {
  response.cookies.set(
    ACCESS_TOKEN_COOKIE,
    accessToken,
    accessTokenCookieOptions
  );
}

export function deleteAuthCookies(
  response: NextResponse
) {
  response.cookies.delete(ACCESS_TOKEN_COOKIE);
  response.cookies.delete(REFRESH_TOKEN_COOKIE);
}