import { apiFetch } from './apiClient'
import type { User, Invite } from './types'
export async function getSession(): Promise<User|null> { try { const r=await apiFetch('/api/v1/auth/me'); return r.ok ? await r.json() : null } catch { return null } }
export async function getInvites(): Promise<Invite[]> { try { const r=await apiFetch('/api/v1/invites/me'); return r.ok ? await r.json() : [] } catch { return [] } }
