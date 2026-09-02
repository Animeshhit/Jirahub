"use client";

import { useEffect } from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function RefreshPage() {
  const router = useRouter();
  const searchParams =
    useSearchParams();

  const redirectTo =
    searchParams.get("redirect") || "/";

  useEffect(() => {
    async function refresh() {
      try {
        const response =
          await fetch(
            "/api/v1/auth/refresh",
            {
              method: "POST",
              credentials: "include",
            }
          );

        if (!response.ok) {
          router.replace("/auth/login");
          return;
        }

        /*
         * New cookies have now been set.
         */
        router.replace(redirectTo);
        router.refresh();
      } catch (error) {
        console.error(
          "Session refresh failed:",
          error
        );

        router.replace("/auth/login");
      }
    }

    refresh();
  }, [router, redirectTo]);

  return (
    <div>
      Refreshing session...
    </div>
  );
}