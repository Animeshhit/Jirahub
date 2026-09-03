import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/workspace/create-workspace`,
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
              : backendRes.status === 400
              ? "INVALID_INPUT"
              : "CREATE_WORKSPACE_FAILED",
          message: data.message,
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      workspace: data.workspace,
      message: data.message,
    });
  } catch (error) {
    console.error("Create workspace error:", error);

    return NextResponse.json(
      { success: false, reason: "AUTH_SERVICE_ERROR" },
      { status: 500 }
    );
  }
}