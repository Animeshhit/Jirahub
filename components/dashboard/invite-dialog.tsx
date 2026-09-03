"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function InviteDialog({ workspaceId }: { workspaceId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/workspace/invite-people", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ workspaceId, email }),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.message || "Couldn't send that invite");
      return;
    }
    setSuccess(true);
    setEmail("");
    router.refresh();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setError("");
          setSuccess(false);
        }
      }}
    >
      <DialogTrigger>
        <Button className="min-h-11 rounded-full bg-primary px-5 text-white hover:bg-primary-active">
          Invite people
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-xl bg-surface p-6">
        <DialogHeader>
          <DialogTitle className="text-heading-3 font-bold text-ink">Invite to workspace</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="invite-email" className="text-body-sm text-ink">
              Email address
            </Label>
            <Input
              id="invite-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teammate@company.com"
              className="rounded-xs"
            />
          </div>
          {error && <p role="alert" className="text-caption text-red-600">{error}</p>}
          {success && <p className="text-caption text-accent-green">Invite sent.</p>}
          <Button
            type="submit"
            disabled={loading || !email}
            className="mt-1 min-h-11 rounded-full bg-primary text-white hover:bg-primary-active disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send invite"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}