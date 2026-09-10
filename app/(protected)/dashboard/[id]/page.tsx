"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Archive,
  ArrowUpRight,
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Code2,
  Columns3,
  Command,
  Copy,
  Ellipsis,
  GitPullRequest,
  LayoutDashboard,
  Link2,
  ListTodo,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import type { Task, TaskStatus, View } from "@/lib/types";
import {
  activities,
  boards,
  pullRequests,
  tasks,
  users,
  workspaces,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar as ShadcnAvatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const nav = [
  { id: "dashboard" as View, label: "Overview", icon: LayoutDashboard },
  { id: "boards" as View, label: "Boards", icon: Columns3 },
  { id: "tasks" as View, label: "My tasks", icon: ListTodo, count: 3 },
  { id: "members" as View, label: "Members", icon: Users },
  { id: "github" as View, label: "GitHub", icon: Code2 },
];
const statuses: TaskStatus[] = ["Todo", "In Progress", "In Review", "Done"];

function Avatar({
  user,
  small = false,
}: {
  user: (typeof users)[number];
  small?: boolean;
}) {
  return (
    <ShadcnAvatar
      className={cn(small ? "size-6" : "size-8")}
      style={{ backgroundColor: user.color }}
      title={user.name}
    >
      <AvatarFallback className="bg-transparent text-[10px] font-semibold text-white">
        {user.initials}
      </AvatarFallback>
    </ShadcnAvatar>
  );
}
function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "blue" | "green" | "orange" | "red";
}) {
  return (
    <Badge
      variant={
        tone === "blue"
          ? "default"
          : tone === "red"
            ? "destructive"
            : "secondary"
      }
      className={cn(
        "text-[11px]",
        {
          neutral: "",
          blue: "",
          green: "bg-accent text-accent-foreground",
          orange: "bg-muted text-foreground",
          red: "bg-destructive text-destructive-foreground",
        }[tone],
      )}
    >
      {children}
    </Badge>
  );
}
function Button({
  children,
  className,
  variant = "primary",
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "quiet" | "outline" | "danger";
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <ShadcnButton
      type={type}
      onClick={onClick}
      variant={
        variant === "primary"
          ? "default"
          : variant === "danger"
            ? "destructive"
            : variant === "quiet"
              ? "ghost"
              : "outline"
      }
      className={cn("gap-2", className)}
    >
      {children}
    </ShadcnButton>
  );
}
function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          {eyebrow}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
function Stat({
  label,
  value,
  note,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof Activity;
  tone?: "blue" | "green" | "orange";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-[0_1px_2px_rgb(30_40_60/0.03)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span
          className={cn(
            "grid size-8 place-items-center rounded-lg",
            {
              blue: "bg-accent text-primary",
              green: "bg-[#e7f4ec] text-[#267248]",
              orange: "bg-[#fff0df] text-[#a25c18]",
            }[tone],
          )}
        >
          <Icon size={16} />
        </span>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
        <span className="text-xs text-muted-foreground">{note}</span>
      </div>
    </div>
  );
}
function Dashboard({ onView }: { onView: (view: View) => void }) {
  return (
    <div>
      <SectionHeader
        eyebrow="Monday, September 8"
        title="Good morning, Maya"
        description="Here’s what’s happening across Acme Engineering."
        action={
          <Button onClick={() => onView("boards")}>
            <Plus size={16} /> New task
          </Button>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Open tasks"
          value="18"
          note="+4 this week"
          icon={ListTodo}
        />
        <Stat
          label="Completed"
          value="42"
          note="76% of sprint"
          icon={Check}
          tone="green"
        />
        <Stat
          label="Active members"
          value="8"
          note="2 pending"
          icon={Users}
          tone="orange"
        />
        <Stat
          label="Open PRs"
          value="6"
          note="2 need review"
          icon={GitPullRequest}
        />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-semibold">My tasks</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Your next most important work
              </p>
            </div>
            <Button variant="quiet" onClick={() => onView("tasks")}>
              View all <ArrowUpRight size={14} />
            </Button>
          </div>
          <div className="divide-y divide-border">
            {tasks.slice(0, 4).map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onClick={() => onView("tasks")}
              />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="font-semibold">Recent activity</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Across your workspace
              </p>
            </div>
            <Button variant="quiet">
              <MoreHorizontal size={16} />
            </Button>
          </div>
          <div className="space-y-5 p-5">
            {activities.map((item) => (
              <div className="flex gap-3" key={item.id}>
                <Avatar user={item.actor} small />
                <p className="min-w-0 flex-1 text-sm leading-5">
                  <strong className="font-medium">{item.actor.name}</strong>{" "}
                  {item.action}{" "}
                  <span className="text-muted-foreground">{item.target}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {item.time}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-border bg-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-semibold">GitHub pulse</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your connected repositories this week
            </p>
          </div>
          <Button variant="quiet" onClick={() => onView("github")}>
            Open GitHub <ArrowUpRight size={14} />
          </Button>
        </div>
        <div className="mt-5 flex flex-wrap gap-8">
          <div>
            <p className="text-2xl font-semibold">24</p>
            <p className="text-xs text-muted-foreground">Commits</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">8</p>
            <p className="text-xs text-muted-foreground">Pull requests</p>
          </div>
          <div>
            <p className="text-2xl font-semibold">3</p>
            <p className="text-xs text-muted-foreground">Reviews</p>
          </div>
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2 rounded-full bg-[#35a866]" /> All systems
            operational
          </div>
        </div>
      </div>
    </div>
  );
}
function TaskRow({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-muted/60"
    >
      <span
        className={cn(
          "size-2 rounded-full",
          task.status === "Done"
            ? "bg-[#35a866]"
            : task.status === "In Progress"
              ? "bg-primary"
              : task.priority === "Urgent"
                ? "bg-destructive"
                : "bg-border",
        )}
      />
      <span className="w-14 text-xs font-medium text-muted-foreground">
        {task.key}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm">{task.title}</span>
      <Pill
        tone={
          task.status === "Done"
            ? "green"
            : task.status === "In Progress"
              ? "blue"
              : "neutral"
        }
      >
        {task.status}
      </Pill>
      <Avatar user={task.assignee} small />
    </button>
  );
}
function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-border bg-card p-3 text-left shadow-[0_1px_2px_rgb(30_40_60/0.04)] transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground">
          {task.key}
        </span>
        <Ellipsis size={15} className="text-muted-foreground" />
      </div>
      <p className="text-sm font-medium leading-5">{task.title}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {task.labels.map((label) => (
          <Pill key={label} tone={label === "Engineering" ? "blue" : "neutral"}>
            {label}
          </Pill>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Avatar user={task.assignee} small />
        <span
          className={cn(
            "text-[11px] font-medium",
            task.priority === "Urgent"
              ? "text-destructive"
              : "text-muted-foreground",
          )}
        >
          {task.priority}
        </span>
      </div>
    </button>
  );
}
function Boards({ onTask }: { onTask: (task: Task) => void }) {
  const [query, setQuery] = useState("");
  const [localTasks, setLocalTasks] = useState(tasks);
  const filtered = useMemo(
    () =>
      localTasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.key.toLowerCase().includes(query.toLowerCase()),
      ),
    [localTasks, query],
  );
  return (
    <div>
      <SectionHeader
        eyebrow="Workspace / Boards"
        title="Product roadmap"
        description="Plan and ship the next great thing."
        action={
          <Button>
            <Plus size={16} /> Add task
          </Button>
        }
      />
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
          <Search
            size={15}
            className="absolute left-3 top-2.5 text-muted-foreground"
          />
          <input
            aria-label="Search tasks"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks..."
            className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </div>
        <Button variant="outline">
          <Command size={14} /> Filter
        </Button>
        <Button variant="outline">
          All assignees <ChevronDown size={14} />
        </Button>
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} tasks
        </span>
      </div>
      <div className="-mx-1 overflow-x-auto px-1 pb-3">
        <div className="grid min-w-[980px] grid-cols-4 gap-3">
          {statuses.map((status) => (
            <div key={status} className="rounded-xl bg-muted/60 p-2">
              <div className="flex items-center justify-between px-2 py-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      status === "Done"
                        ? "bg-[#35a866]"
                        : status === "In Progress"
                          ? "bg-primary"
                          : status === "In Review"
                            ? "bg-[#d9892b]"
                            : "bg-muted-foreground",
                    )}
                  />
                  <h3 className="text-sm font-semibold">{status}</h3>
                  <span className="text-xs text-muted-foreground">
                    {filtered.filter((t) => t.status === status).length}
                  </span>
                </div>
                <button className="rounded p-1 text-muted-foreground hover:bg-card">
                  <Plus size={15} />
                </button>
              </div>
              <div className="space-y-2">
                {filtered
                  .filter((t) => t.status === status)
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => onTask(task)}
                    />
                  ))}
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground hover:border-primary hover:text-primary">
                  <Plus size={14} /> Add task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function TasksPage({ onTask }: { onTask: (task: Task) => void }) {
  return (
    <div>
      <SectionHeader
        eyebrow="Workspace"
        title="My tasks"
        description="Everything assigned to you, in one place."
        action={
          <Button>
            <Plus size={16} /> New task
          </Button>
        }
      />
      <div className="mb-4 flex gap-2">
        <Button variant="primary">
          All tasks{" "}
          <span className="rounded bg-white/20 px-1.5 text-xs">3</span>
        </Button>
        <Button variant="quiet">In progress</Button>
        <Button variant="quiet">Completed</Button>
      </div>
      <div className="rounded-xl border border-border bg-card">
        <div className="grid grid-cols-[90px_1fr_130px_110px_100px] gap-4 border-b border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Key</span>
          <span>Task</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Due</span>
        </div>
        {tasks.map((task) => (
          <button
            key={task.id}
            onClick={() => onTask(task)}
            className="grid w-full grid-cols-[90px_1fr_130px_110px_100px] items-center gap-4 border-b border-border px-5 py-3 text-left last:border-0 hover:bg-muted/50"
          >
            <span className="text-xs font-medium text-muted-foreground">
              {task.key}
            </span>
            <span className="truncate text-sm font-medium">{task.title}</span>
            <Pill
              tone={
                task.status === "Done"
                  ? "green"
                  : task.status === "In Progress"
                    ? "blue"
                    : "neutral"
              }
            >
              {task.status}
            </Pill>
            <span className="text-xs text-muted-foreground">
              {task.priority}
            </span>
            <span className="text-xs text-muted-foreground">
              {task.due ?? "—"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
function Members() {
  const [inviting, setInviting] = useState(false);
  return (
    <div>
      <SectionHeader
        eyebrow="Workspace"
        title="Members"
        description="Manage who can access Acme Engineering."
        action={
          <Button onClick={() => setInviting(true)}>
            <UserPlus size={16} /> Invite member
          </Button>
        }
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Stat
          label="Total members"
          value="8"
          note="+2 this month"
          icon={Users}
        />
        <Stat
          label="Admins"
          value="2"
          note="Full access"
          icon={ShieldCheck}
          tone="orange"
        />
        <Stat
          label="Pending"
          value="2"
          note="Awaiting invite"
          icon={Bell}
          tone="green"
        />
      </div>
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold">Workspace members</h2>
          <Button variant="outline">
            <Search size={14} /> Search
          </Button>
        </div>
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 border-b border-border px-5 py-4 last:border-0"
          >
            <Avatar user={user} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
            <Pill tone={user.role === "Admin" ? "blue" : "neutral"}>
              {user.role}
            </Pill>
            <span className="hidden text-xs text-muted-foreground sm:block">
              Joined Aug 12, 2026
            </span>
            <button className="rounded p-1 text-muted-foreground hover:bg-muted">
              <MoreHorizontal size={17} />
            </button>
          </div>
        ))}
      </div>
      {inviting && (
        <Modal title="Invite to workspace" onClose={() => setInviting(false)}>
          <p className="text-sm text-muted-foreground">
            Invite teammates to collaborate on projects and tasks.
          </p>
          <label className="mt-5 block text-sm font-medium">
            Email address
            <input
              autoFocus
              type="email"
              placeholder="teammate@company.com"
              className="mt-2 h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary"
            />
          </label>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="quiet" onClick={() => setInviting(false)}>
              Cancel
            </Button>
            <Button onClick={() => setInviting(false)}>Send invite</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
function GithubPage() {
  const [connected, setConnected] = useState(true);
  return (
    <div>
      <SectionHeader
        eyebrow="Integrations"
        title="GitHub"
        description="Connect code to the work your team is planning."
        action={
          <Button
            variant={connected ? "outline" : "primary"}
            onClick={() => setConnected(!connected)}
          >
            {connected ? (
              <>
                <Check size={15} /> Connected
              </>
            ) : (
              <>
                <Link2 size={15} /> Connect GitHub
              </>
            )}
          </Button>
        }
      />
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-[#20242d] text-white">
            {/* <Github size={21} /> */}
            Github
          </span>
          <div>
            <h2 className="font-semibold">Acme GitHub organization</h2>
            <p className="text-sm text-muted-foreground">
              {connected
                ? "Connected and syncing repositories"
                : "Not connected"}
            </p>
          </div>
          <span
            className={cn(
              "ml-auto size-2.5 rounded-full",
              connected ? "bg-[#35a866]" : "bg-muted-foreground",
            )}
          />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg bg-muted/70 p-3">
            <p className="text-xs text-muted-foreground">Repositories</p>
            <p className="mt-1 text-lg font-semibold">4</p>
          </div>
          <div className="rounded-lg bg-muted/70 p-3">
            <p className="text-xs text-muted-foreground">Open pull requests</p>
            <p className="mt-1 text-lg font-semibold">6</p>
          </div>
          <div className="rounded-lg bg-muted/70 p-3">
            <p className="text-xs text-muted-foreground">Last sync</p>
            <p className="mt-1 text-lg font-semibold">2m ago</p>
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">Pull requests</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Linked work from your repositories
          </p>
        </div>
        {pullRequests.map((pr) => (
          <div
            key={pr.id}
            className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-4 last:border-0"
          >
            <GitPullRequest size={17} className="text-primary" />
            <div className="min-w-[220px] flex-1">
              <p className="text-sm font-medium">
                {pr.title}{" "}
                <span className="text-muted-foreground">#{pr.number}</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {pr.repo} · updated {pr.updated}
              </p>
            </div>
            <Pill
              tone={
                pr.status === "Merged"
                  ? "green"
                  : pr.status === "Open"
                    ? "blue"
                    : "neutral"
              }
            >
              {pr.status}
            </Pill>
            {pr.taskKey && <Pill>{pr.taskKey}</Pill>}
            <Avatar user={pr.author} small />
          </div>
        ))}
      </div>
    </div>
  );
}
function SettingsPage() {
  return (
    <div>
      <SectionHeader
        eyebrow="Workspace"
        title="Settings"
        description="Configure your workspace and integrations."
        action={
          <Button>
            <Check size={16} /> Save changes
          </Button>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1">
          <button className="w-full rounded-lg bg-accent px-3 py-2 text-left text-sm font-medium text-accent-foreground">
            General
          </button>
          <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted">
            Notifications
          </button>
          <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted">
            Members & roles
          </button>
          <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted">
            Integrations
          </button>
        </nav>
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold">Workspace details</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This is how your workspace appears to your team.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Workspace name
                <input
                  defaultValue="Acme Engineering"
                  className="mt-2 h-10 w-full rounded-lg border border-border px-3 text-sm outline-none focus:border-primary"
                />
              </label>
              <label className="text-sm font-medium">
                Workspace URL
                <div className="mt-2 flex h-10 items-center rounded-lg border border-border px-3 text-sm text-muted-foreground">
                  <span>acme.dev/</span>
                  <input
                    defaultValue="engineering"
                    className="min-w-0 flex-1 outline-none"
                  />
                </div>
              </label>
            </div>
          </div>
          <div className="rounded-xl border border-[#e5b8b3] bg-[#fff9f8] p-5">
            <h2 className="font-semibold text-[#9b3930]">Danger zone</h2>
            <p className="mt-1 text-sm text-[#9b3930]/75">
              Deleting this workspace is permanent and cannot be undone.
            </p>
            <Button variant="danger" className="mt-4">
              Delete workspace
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
function TaskModal({ task, onClose }: { task: Task; onClose: () => void }) {
  return (
    <Modal title={task.key} onClose={onClose}>
      <p className="mt-5 text-lg font-medium leading-7">{task.title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {task.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Pill tone="blue">{task.status}</Pill>
        <Pill>{task.priority} priority</Pill>
        {task.labels.map((l) => (
          <Pill key={l}>{l}</Pill>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
        <Avatar user={task.assignee} small />
        <span className="text-sm">Assigned to {task.assignee.name}</span>
        <Button className="ml-auto" onClick={onClose}>
          Done
        </Button>
      </div>
    </Modal>
  );
}
export default function AppShell() {
  const [view, setView] = useState<View>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [workspace, setWorkspace] = useState(workspaces[0]);
  const content =
    view === "dashboard" ? (
      <Dashboard onView={setView} />
    ) : view === "boards" ? (
      <Boards onTask={setSelectedTask} />
    ) : view === "tasks" ? (
      <TasksPage onTask={setSelectedTask} />
    ) : view === "members" ? (
      <Members />
    ) : view === "github" ? (
      <GithubPage />
    ) : (
      <SettingsPage />
    );
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-border px-5">
          <div className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Command size={17} />
          </div>
          <span className="font-semibold tracking-tight">Acme workspace</span>
          <button
            className="ml-auto rounded p-1 text-muted-foreground lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-3">
          <button
            onClick={() =>
              setWorkspace(
                workspace === workspaces[0] ? workspaces[1] : workspaces[0],
              )
            }
            className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted"
          >
            <span className="grid size-8 place-items-center rounded-md bg-[#e8e4dd] text-xs font-bold text-foreground">
              AE
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {workspace}
              </span>
              <span className="block text-xs text-muted-foreground">
                8 members
              </span>
            </span>
            <ChevronDown size={15} className="text-muted-foreground" />
          </button>
        </div>
        <nav className="flex-1 px-3">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Workspace
          </p>
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setMobileOpen(false);
              }}
              className={cn(
                "mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                view === item.id
                  ? "bg-accent font-medium text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon size={16} />
              {item.label}
              {item.count && (
                <span className="ml-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
                  {item.count}
                </span>
              )}
            </button>
          ))}
          <p className="mb-2 mt-8 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Manage
          </p>
          <button
            onClick={() => setView("settings")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Settings size={16} /> Settings
          </button>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
            <CircleHelp size={16} /> Help center
          </button>
        </nav>
        <div className="border-t border-border p-3">
          <button className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted">
            <Avatar user={users[0]} />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">Maya Chen</span>
              <span className="block truncate text-xs text-muted-foreground">
                maya@acme.dev
              </span>
            </span>
            <ChevronRight size={15} className="text-muted-foreground" />
          </button>
        </div>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur md:px-8">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
            <span>Acme Engineering</span>
            <ChevronRight size={14} />
            <span className="font-medium text-foreground">
              {nav.find((n) => n.id === view)?.label ?? "Settings"}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button className="hidden h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground hover:bg-muted md:flex">
              <Search size={15} /> Search
              <span className="ml-6 text-xs">⌘ K</span>
            </button>
            <button
              className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
              aria-label="Notifications"
            >
              <Bell size={17} />
            </button>
            <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
            <Avatar user={users[0]} small />
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] p-4 md:p-8">{content}</main>
      </div>
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-foreground/20 lg:hidden"
        />
      )}
    </div>
  );
}
