"use client";

import { useState } from "react";
import { Plus, Users, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import useSWR from "swr";

interface Workspace {
  _id: number;
  id: string;
  name: string;
  createdBy: string;
  createdOn: string;
  profileImage: string;
}

export default function Page() {
  const [mode, setMode] = useState<"choose" | "create" | "join">("choose");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [invite, setInvite] = useState("");
  const router = useRouter();

  const { data, error, isLoading } = useSWR("/api/workspaces/get", (url) =>
    fetch(url).then((res) => res.json()),
  );

  const workspaces: Workspace[] = data?.success ? data.workspaces : [];

  const submit = async () => {
    setLoading(true);
    const value = mode === "create" ? name.trim() : invite.trim();
    let url =
      mode == "create" ? "/api/workspaces/create" : "/api/workspaces/join";

    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        mode === "create" ? { name: value } : { inviteCode: value },
      ),
    });

    let data = await response.json();

    if (data.success) {
      router.replace(`/dashboard/${data.workspace?.id}`);
    } else {
      alert(data.message || "An error occurred");
    }

    setLoading(false);
  };

  const openWorkspace = (id: string) => {
    router.push(`/dashboard/${id}`);
  };

  const description =
    mode === "choose"
      ? workspaces.length > 0
        ? "Pick a workspace or start something new."
        : "Choose how you'd like to use Jirahub."
      : mode === "create"
        ? "This is where your team will plan, create, and ship."
        : "Enter the invite code your teammate sent you.";

  // simple deterministic color per workspace, based on name
  const colors = [
    "bg-sky-100 text-sky-900",
    "bg-orange-100 text-orange-900",
    "bg-purple-100 text-purple-900",
    "bg-emerald-100 text-emerald-900",
    "bg-rose-100 text-rose-900",
  ];
  const colorFor = (id: string) => {
    const sum = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  return (
    <main className="min-h-screen bg-card">
      <header className="flex h-16 items-center justify-between px-5 md:px-12">
        <div className="flex items-center gap-2">
          <div className="grid size-7 place-items-center rounded-lg bg-secondary font-bold italic text-primary-foreground">
            s
          </div>
          <span className="font-semibold tracking-tight">Jirahub</span>
        </div>
        <span className="onboard-account text-sm text-muted-foreground">
          Already have a workspace?{" "}
          <Button
            variant="link"
            className="px-1"
            onClick={() => setMode(mode === "join" ? "choose" : "join")}
          >
            Join one
          </Button>
        </span>
      </header>
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[1fr_420px] md:px-10 md:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            A better way to work together
          </p>
          <h1 className="mt-4 text-balance text-5xl font-bold leading-none tracking-[-2.5px] md:text-7xl">
            Make space for
            <br />
            <span className="text-primary">great work.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Jirahub brings your team&apos;s ideas, tasks, and momentum into one
            clear, calm workspace.
          </p>
          <div className="mt-10 flex items-center gap-2 text-xs text-muted-foreground">
            <Avatar className="size-8">
              <AvatarFallback className="bg-orange-200 text-orange-900">
                JL
              </AvatarFallback>
            </Avatar>
            <Avatar className="-ml-3 size-8">
              <AvatarFallback className="bg-purple-200 text-purple-900">
                SK
              </AvatarFallback>
            </Avatar>
            <span className="ml-2">
              Made for teams who care about the details.
            </span>
          </div>
        </div>
        <Card className="p-2">
          <CardHeader>
            <CardTitle>
              {mode === "choose"
                ? "Let's get started"
                : mode === "create"
                  ? "Name your workspace"
                  : "Join your team"}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {mode === "choose" ? (
              <>
                {isLoading && (
                  <div className="flex flex-col gap-2">
                    <div className="h-14 animate-pulse rounded-lg bg-zinc-200" />
                    <div className="h-14 animate-pulse rounded-lg bg-zinc-200" />
                  </div>
                )}

                {!isLoading && workspaces.length > 0 && (
                  <div className="flex flex-col gap-2 mb-2">
                    {workspaces.map((ws) => (
                      <button
                        key={ws.id}
                        onClick={() => openWorkspace(ws.id)}
                        className="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-gray-50 cursor-pointer"
                      >
                        {ws.profileImage ? (
                          <img
                            src={ws.profileImage}
                            alt={ws.name}
                            className="size-9 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <span
                            className={`grid size-9 shrink-0 place-items-center rounded-lg font-semibold ${colorFor(
                              ws.id,
                            )}`}
                          >
                            {ws.name.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <strong className="block truncate">{ws.name}</strong>
                          <small className="text-muted-foreground">
                            Created{" "}
                            {new Date(ws.createdOn).toLocaleDateString()}
                          </small>
                        </span>
                        <span className="text-muted-foreground">→</span>
                      </button>
                    ))}
                  </div>
                )}

                <Button
                  variant="outline"
                  className="h-auto justify-start gap-3 p-4 text-left hover:bg-gray-200 cursor-pointer"
                  onClick={() => setMode("create")}
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-sky-50 text-primary">
                    <Plus />
                  </span>
                  <span>
                    <strong className="block">Create a workspace</strong>
                    <small className="text-muted-foreground">
                      Start fresh with your team
                    </small>
                  </span>
                  <span className="ml-auto">→</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto justify-start gap-3 p-4 text-left hover:bg-gray-200 cursor-pointer"
                  onClick={() => setMode("join")}
                >
                  <span className="grid size-9 place-items-center rounded-lg bg-purple-50 text-purple-900">
                    <Users />
                  </span>
                  <span>
                    <strong className="block">Join a workspace</strong>
                    <small className="text-muted-foreground">
                      Enter an invite code from a teammate
                    </small>
                  </span>
                  <span className="ml-auto">→</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="link"
                  className="w-fit px-0 cursor-pointer"
                  onClick={() => setMode("choose")}
                >
                  ← Back
                </Button>
                <Label htmlFor="workspace">
                  {mode === "create" ? "Workspace name" : "Invite code"}
                </Label>
                <Input
                  id="workspace"
                  value={mode === "create" ? name : invite}
                  onChange={(e) =>
                    mode === "create"
                      ? setName(e.target.value)
                      : setInvite(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.nativeEvent.isComposing &&
                      e.keyCode !== 229
                    )
                      submit();
                  }}
                  autoFocus
                  placeholder={
                    mode === "create"
                      ? "e.g. Northstar Studio"
                      : "e.g. SPR-4829"
                  }
                />
                <Button
                  disabled={loading}
                  className="mt-2 cursor-pointer w-full rounded-full"
                  onClick={submit}
                >
                  {mode === "create" ? "Create workspace" : "Join workspace"}{" "}
                  <span>→</span>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
