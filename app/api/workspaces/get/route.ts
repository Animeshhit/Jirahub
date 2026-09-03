import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, reason: "ACCESS_TOKEN_MISSING" },
      { status: 401 }
    );
  }

  try {
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/workspace/get-workspaces`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
              : "GET_WORKSPACES_FAILED",
          message: data.message,
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      workspaces: data.workspaces,
    });
  } catch (error) {
    console.error("Get workspaces error:", error);

    return NextResponse.json(
      { success: false, reason: "AUTH_SERVICE_ERROR" },
      { status: 500 }
    );
  }
}