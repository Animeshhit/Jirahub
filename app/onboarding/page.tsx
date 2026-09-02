import { getInvites, getSession } from '@/lib/session'
import { Onboarding } from '@/components/onboarding'
export const dynamic='force-dynamic'
export default async function Page(){const [user,invites]=await Promise.all([getSession(),getInvites()]); return <Onboarding user={user} invites={invites}/>} 
