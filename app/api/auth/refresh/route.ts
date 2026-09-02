import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  setAccessTokenCookie,
} from "@/lib/auth/cookies";

export async function POST() {
  const cookieStore = await cookies();

  const refreshToken =
    cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      {
        authenticated: false,
        message: "Refresh token missing",
      },
      { status: 401 }
    );
  }

  try {
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
      {
        method: "POST",
        headers: {
          Cookie: `refreshToken=${refreshToken}`,
        },
        cache: "no-store",
      }
    );

    const data =
      await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          authenticated: false,
          message:
            data.message ?? "Refresh failed",
        },
        {
          status: backendRes.status,
        }
      );
    }

    const { accessToken } = data;

    if (!accessToken) {
      return NextResponse.json(
        {
          authenticated: false,
          message:
            "Access token missing from refresh response",
        },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      authenticated: true,
    });

    /*
     * Store new access token.
     */
    setAccessTokenCookie(
      response,
      accessToken
    );

    /*
     * Backend rotates refreshToken.
     *
     * Forward every Set-Cookie header.
     */
    const setCookies =
      backendRes.headers.getSetCookie?.() ?? [];

    for (const cookie of setCookies) {
      response.headers.append(
        "set-cookie",
        cookie
      );
    }

    return response;
  } catch (error) {
    console.error(
      "Refresh route error:",
      error
    );

    return NextResponse.json(
      {
        authenticated: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}