import { LayoutGrid } from "lucide-react";

export function BoardsEmptyState() {
  return (
    <div className="mt-5 flex flex-col items-center rounded-xl border border-hairline bg-surface px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-accent-purple/30">
        <LayoutGrid className="h-6 w-6 text-secondary" />
      </div>
      <p className="text-title font-semibold text-ink">Boards are on the way</p>
      <p className="mt-2 max-w-sm text-body-sm text-ink-muted">
        You&apos;ll be able to create boards here to organize your team&apos;s work.
      </p>
    </div>
  );
}