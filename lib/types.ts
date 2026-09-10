export type View =
  | "dashboard"
  | "boards"
  | "tasks"
  | "members"
  | "github"
  | "settings";
export type TaskStatus = "Todo" | "In Progress" | "In Review" | "Done";
export type Priority = "Low" | "Medium" | "High" | "Urgent";
export type Role = "Admin" | "Member" | "Viewer";

export type User = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: Role;
  status: "Active" | "Invited";
  color: string;
};
export type Task = {
  id: string;
  key: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee: User;
  labels: string[];
  due?: string;
  points: number;
};
export type Board = {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
};
export type Activity = {
  id: string;
  actor: User;
  action: string;
  target: string;
  time: string;
  type: "task" | "github" | "member";
};
export type PullRequest = {
  id: string;
  title: string;
  number: number;
  author: User;
  status: "Open" | "Merged" | "Draft";
  repo: string;
  taskKey?: string;
  updated: string;
};
