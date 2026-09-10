import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  deleteAuthCookies,
  setAccessTokenCookie,
  setRefreshTokenCookie,
} from "@/lib/auth/cookies";

export async function POST() {
  const cookieStore = await cookies();

  const refreshToken =
    cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    const response = NextResponse.json(
      {
        authenticated: false,
        message: "Refresh token missing",
      },
      { status: 401 }
    );

    deleteAuthCookies(response);
    return response;
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
      const response = NextResponse.json(
        {
          authenticated: false,
          message:
            data.message ?? "Refresh failed",
        },
        {
          status: backendRes.status,
        }
      );

      deleteAuthCookies(response);
      return response;
    }

    const { accessToken, refreshToken: nextRefreshToken } = data;

    if (!accessToken) {
      const response = NextResponse.json(
        {
          authenticated: false,
          message:
            "Access token missing from refresh response",
        },
        { status: 500 }
      );

      deleteAuthCookies(response);
      return response;
    }

    const response = NextResponse.json({
      authenticated: true,
    });

    setAccessTokenCookie(response, accessToken);

    if (nextRefreshToken) {
      setRefreshTokenCookie(response, nextRefreshToken);
    }

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

    const response = NextResponse.json(
      {
        authenticated: false,
        message: "Internal server error",
      },
      { status: 500 }
    );

    deleteAuthCookies(response);
    return response;
  }
}