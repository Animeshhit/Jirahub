import { notFound } from "next/navigation";
import { getWorkspaceDetails } from "@/lib/workspace/workspaces";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { MemberList } from "@/components/dashboard/member-list";
import { BoardsEmptyState } from "@/components/dashboard/boards-empty-state";
import { InviteDialog } from "@/components/dashboard/invite-dialog";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getWorkspaceDetails(id);

  console.log(data);

  // covers "doesn't exist" and "you're not a member" the same way,
  // rather than revealing which one it was
  if (!data) notFound();

  const { workspace, members } = data;

  return (
    <div className="flex min-h-screen flex-col bg-canvas-soft lg:flex-row">
      <AppSidebar workspaceName={workspace.name} workspaceId={workspace.id} />

      <main className="flex-1 px-6 py-8 sm:px-10 lg:px-12">
        <header
          id="overview"
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-eyebrow font-semibold text-primary">Workspace</p>
            <h1 className="mt-1 text-heading-1 font-bold tracking-[-1px] text-ink">
              {workspace.name}
            </h1>
            <p className="mt-2 text-body-sm text-ink-muted">
              {members.length} {members.length === 1 ? "member" : "members"}
            </p>
          </div>
          <InviteDialog workspaceId={workspace.id} />
        </header>

        <section id="people" className="mt-10">
          <h2 className="text-heading-3 font-bold text-ink">People</h2>
          <MemberList members={members} />
        </section>

        <section id="boards" className="mt-12">
          <h2 className="text-heading-3 font-bold text-ink">Boards</h2>
          <BoardsEmptyState />
        </section>
      </main>
    </div>
  );
}