import { cookies } from "next/headers";
import type { WorkspaceDetail } from "../types";

export async function getWorkspaceDetails(
  workspaceId: string
): Promise<WorkspaceDetail | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) return null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/workspace/${workspaceId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}