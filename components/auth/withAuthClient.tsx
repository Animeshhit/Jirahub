"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import type { User } from "@/lib/auth/server";

export function withAuthClient<
  P extends object
>(
  Component: React.ComponentType<
    P & { user: User }
  >
) {
  return function ProtectedClientComponent(
    props: P
  ) {
    const router = useRouter();

    const [user, setUser] =
      useState<User | null>(null);

    const [loading, setLoading] =
      useState(true);

    useEffect(() => {
      let cancelled = false;

      async function authenticate() {
        try {
          /*
           * First attempt:
           * accessToken → /me
           */
          let response = await fetch(
            "/api/auth/me",
            {
              method: "GET",
              credentials: "include",
              cache: "no-store",
            }
          );

          /*
           * Access token missing/expired.
           */
          if (response.status === 401) {
            /*
             * Attempt refresh.
             */
            const refreshResponse =
              await fetch(
                "/api/auth/refresh",
                {
                  method: "POST",
                  credentials: "include",
                }
              );

            /*
             * Refresh token invalid/expired.
             */
            if (!refreshResponse.ok) {
              router.replace("/auth/login");
              return;
            }

            /*
             * Retry /me using new access token.
             */
            response = await fetch(
              "/api/auth/me",
              {
                method: "GET",
                credentials: "include",
                cache: "no-store",
              }
            );
          }

          if (!response.ok) {
            router.replace("/auth/login");
            return;
          }

          const data =
            await response.json();

          if (!cancelled) {
            setUser(data.user);
          }
        } catch (error) {
          console.error(
            "Client authentication error:",
            error
          );

          router.replace("/auth/login");
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      }

      authenticate();

      return () => {
        cancelled = true;
      };
    }, [router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!user) {
      return null;
    }

    return (
      <Component
        {...props}
        user={user}
      />
    );
  };
}