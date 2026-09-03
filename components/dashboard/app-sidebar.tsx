"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, LayoutGrid, Users, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { label: "Overview", href: "#overview", icon: LayoutGrid, enabled: true },
  { label: "People", href: "#people", icon: Users, enabled: true },
  { label: "Boards", href: "#boards", icon: LayoutGrid, enabled: false },
  { label: "Settings", href: "#settings", icon: Settings, enabled: false },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ label, href, icon: Icon, enabled }) =>
        enabled ? (
          <Link
            key={label}
            href={href}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-sm px-4 py-3 text-body-sm text-ink transition hover:bg-canvas-soft"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ) : (
          <div
            key={label}
            className="flex cursor-not-allowed items-center justify-between rounded-sm px-4 py-3 text-body-sm text-ink-faint"
          >
            <span className="flex items-center gap-3">
              <Icon className="h-4 w-4" />
              {label}
            </span>
            <span className="rounded-full bg-canvas-soft px-2 py-0.5 text-[11px] font-semibold text-ink-faint">
              Soon
            </span>
          </div>
        )
      )}
    </nav>
  );
}

export function AppSidebar({
  workspaceName,
}: {
  workspaceName: string;
  workspaceId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-hairline bg-canvas px-4 py-6 lg:flex lg:flex-col">
        <p className="truncate px-4 text-title font-semibold text-ink">{workspaceName}</p>
        <div className="mt-6">
          <NavList />
        </div>
      </aside>

      <div className="flex items-center justify-between border-b border-hairline bg-canvas px-4 py-3 lg:hidden">
        <p className="truncate text-title font-semibold text-ink">{workspaceName}</p>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <button
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-black/5"
            >
              <Menu className="h-5 w-5 text-ink" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-canvas">
            <p className="px-2 py-4 text-title font-semibold text-ink">{workspaceName}</p>
            <NavList onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}