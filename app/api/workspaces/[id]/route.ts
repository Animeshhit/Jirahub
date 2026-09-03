import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ success: false, reason: "ACCESS_TOKEN_MISSING" }, { status: 401 });
  }

  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/workspace/${id}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    const data = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          success: false,
          reason:
            backendRes.status === 403 ? "NOT_A_MEMBER" :
            backendRes.status === 404 ? "WORKSPACE_NOT_FOUND" :
            "GET_WORKSPACE_FAILED",
          message: data.message,
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error("Get workspace error:", error);
    return NextResponse.json({ success: false, reason: "AUTH_SERVICE_ERROR" }, { status: 500 });
  }
}