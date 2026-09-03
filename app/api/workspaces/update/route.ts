import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, reason: "ACCESS_TOKEN_MISSING" },
      { status: 401 }
    );
  }

  const body = await request.text();

  try {
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/workspace/update-workspace`,
      {
        method: "PATCH",
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
              ? "NOT_ADMIN"
              : backendRes.status === 404
              ? "MEMBER_OR_WORKSPACE_NOT_FOUND"
              : backendRes.status === 400
              ? "INVALID_INPUT"
              : "UPDATE_WORKSPACE_FAILED",
          message: data.message,
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message,
    });
  } catch (error) {
    console.error("Update workspace error:", error);

    return NextResponse.json(
      { success: false, reason: "AUTH_SERVICE_ERROR" },
      { status: 500 }
    );
  }
}