export type User = { id: string; name: string; email: string; workspaceId?: string | null }
export type Workspace = { id: string; name: string; slug?: string }
export type Invite = { id: string; workspace?: Workspace; workspaceName?: string; inviterName?: string; email?: string }
export type ApiResult<T> = { data?: T; error?: string; status: number }
