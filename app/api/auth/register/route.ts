import { NextResponse } from "next/server";
import {
  setAccessTokenCookie,
} from "@/lib/auth/cookies";

export async function POST(request: Request) {
  const body = await request.text();

  const backendRes = await fetch(
    `${process.env.API_URL}/api/v1/auth/register`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body,
      cache: "no-store",
    }
  );

  const data = await backendRes.json().catch(() => ({}));

  if (!backendRes.ok) {
    return NextResponse.json(
      data,
      {
        status: backendRes.status,
      }
    );
  }

  const {
    accessToken,
    user,
    message,
  } = data as {
    accessToken: string;
    user: unknown;
    message: string;
  };

  if (!accessToken) {
    return NextResponse.json(
      {
        message:
          "Access token missing from server response",
      },
      { status: 500 }
    );
  }

  const response = NextResponse.json(
    {
      message,
      user,
    },
    {
      status: backendRes.status,
    }
  );

  setAccessTokenCookie(
    response,
    accessToken
  );

  const setCookies =
    backendRes.headers.getSetCookie?.() ?? [];

  for (const cookie of setCookies) {
    response.headers.append(
      "set-cookie",
      cookie
    );
  }

  return response;
}