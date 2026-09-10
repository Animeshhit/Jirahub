# JiraHub — Team Collaboration Platform

A full-stack team collaboration platform for managing workspaces, teams, boards, and tasks — a Trello/Jira-style tool with planned GitHub integration for connecting real development workflow (PRs, webhooks) to task tracking.

## Features

| Feature | Status |
|---|---|
| User signup / signin | ✅ Done |
| Create workspace / organization | ✅ Done |
| Invite people to workspace | ✅ Done |
| Join workspace / organization | ✅ Done |
| Role-based access control | ❌ Not started |
| Create board (admin only) | ✅ Done |
| Create tasks | ✅ Done |
| Assign tasks | ✅ Done |
| Change status of tasks | ✅ Done |

### Planned: GitHub Integration
- Connect a GitHub repo to a workspace/board
- Push webhook to sync commit activity
- PR review linkage to tasks
- Tag-wise assignment (auto-assign based on PR tags/labels)

## Pages (UI)

- Signup / Signin
- Create Workspace
- Create Board
- Create Tasks
- Invite / Add People
- Join Workspace / Organization

## Database Design

**`users`**
- `_id`, `id`, `name`, `email`, `password`

**`workspace`**
- `_id`, `id`, `createdBy: user.id`, `createdOn`, `peoples: list[users]`, `profileImage: string`

**`board`**
- `_id`, `id`, `workspaceId: workspace.id`, `name`, `createdBy: user.id (admin)`

**`tasks`**
- `_id`, `id`, `name`, `description`, `reporterId: user.id`, `assigneeId: user.id / null`, `status`, `boardId: board.id`, `workspaceId: workspace.id`

**`invites`**
- `_id`, `id`, `inviteFrom: user.id`, `inviteForWorkspace: workspace.id`, `inviteTo: user.id`, `inviteAccepted`

## API Routes

### Auth Routes (`/api/v1/auth`)
- `/login`
- `/register`
- `/refresh`
- `/me`
- `/logout`

### Workspace Routes (`/api/v1/workspace`)
- `/create-workspace`
- `/invite-people`
- `/join-workspace`
- `/get-workspaces`
- `/update-workspace` (remove people)
- `/delete-workspace` (cascades to boards, tasks, memberships, invites)

### Board Routes (`/api/v1/boards`)
- `/create-board`
- `/update-board`
- `/delete-board` (deletes all tasks under the board, then the board)
- `/boards`

### Task Routes (`/api/v1/tasks`)
- `/create-task`
- `/update-task` (status update)
- `/delete-task`
- `/assign-task`

## Tech Stack

**Frontend**
- Next.js (App Router) — SSR, SSG, and ISR used per route based on data needs
- TypeScript
- Tailwind CSS + shadcn/ui
- Custom design system (Notion-inspired: warm paper canvas, single blue accent, pill CTAs)

**Backend**
- Node.js + Express
- Drizzle ORM
- PostgreSQL (Supabase)
- JWT (`jsonwebtoken`) + `bcryptjs` for password hashing
- `express-rate-limit` for abuse protection

## Architecture Highlights

- **Cookie-based auth across SSR boundaries**: Server Components fetch user/session data directly from the backend using the `accessToken` cookie forwarded as a Bearer header; Route Handlers proxy client-triggered mutations (login, register, invites, workspace actions) so the browser only ever talks to same-origin endpoints.
- **Token refresh strategy**: Middleware checks token presence on protected routes; a dedicated verification layer (Server Component HOC + Client Component HOC) revalidates against `/api/v1/auth/me` and silently refreshes expired sessions where possible.
- **Indexed schema**: Foreign-key columns and common query patterns (e.g. board + status for kanban filtering, pending invites per user) are explicitly indexed rather than relying on default Postgres behavior.
- **Transactional writes**: Multi-step operations (e.g. accepting an invite → creating membership → marking invite accepted, or deleting a workspace's cascading data) are wrapped in database transactions to avoid partial-state bugs.

## My Role

Frontend Developer — built the authentication flow (login/register UI, token handling, route protection), the workspace dashboard, and the invite management UI, and integrated all of it with the Express/Drizzle backend APIs.

## Roadmap

- [ ] Role-based access control (admin/member permission enforcement)
- [ ] Board and task UI (kanban view)
- [ ] GitHub repo connection, webhooks, PR-linked tasks
- [ ] Workspace settings page (rename, remove members, delete workspace)
- [ ] Real-time updates for task/board changes
