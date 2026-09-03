import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        success: false,
        reason: "ACCESS_TOKEN_MISSING",
      },
      { status: 401 }
    );
  }

  const body = await request.text();

  try {
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/workspace/invite-people`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
        },
        body,
        cache: "no-store",
      }
    );

    const data = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          success: false,
          reason:
            backendRes.status === 401
              ? "ACCESS_TOKEN_INVALID"
              : backendRes.status === 403
              ? "NOT_A_MEMBER"
              : backendRes.status === 404
              ? "USER_NOT_FOUND"
              : backendRes.status === 409
              ? "INVITE_ALREADY_EXISTS"
              : "INVITE_FAILED",
          message: data.message,
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      invite: data.invite,
      message: data.message,
    });
  } catch (error) {
    console.error("Invite people error:", error);

    return NextResponse.json(
      {
        success: false,
        reason: "AUTH_SERVICE_ERROR",
      },
      { status: 500 }
    );
  }
}