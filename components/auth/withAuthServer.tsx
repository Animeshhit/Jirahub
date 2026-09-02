import { redirect } from "next/navigation";

import {
  getCurrentUser,
  type User,
} from "@/lib/auth/server";

export function withAuthServer<
  P extends object
>(
  Component: React.ComponentType<
    P & { user: User }
  >
) {
  return async function ProtectedComponent(
    props: P
  ) {
    const user = await getCurrentUser();

    if (!user) {
      redirect("/auth/login");
    }

    return (
      <Component
        {...props}
        user={user}
      />
    );
  };
}