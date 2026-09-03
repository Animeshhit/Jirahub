import type { WorkspaceMember } from "@/lib/types";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function MemberList({ members }: { members: WorkspaceMember[] }) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <div
          key={member.id}
          className="flex items-center gap-3 rounded-lg border border-hairline bg-surface p-4"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-sky text-sm font-semibold text-secondary">
            {initials(member.name)}
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-2 truncate text-body-sm font-medium text-ink">
              {member.name}
              {member.isAdmin && (
                <span className="rounded-full bg-canvas-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
                  Admin
                </span>
              )}
            </p>
            <p className="truncate text-caption text-ink-muted">{member.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
}