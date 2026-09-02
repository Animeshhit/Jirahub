import { proxy } from '@/lib/apiClient'
export async function POST(request:Request,{params}:{params:Promise<{action:string}>}){const {action}=await params;const allowed=['login','register','logout'];if(!allowed.includes(action))return new Response('Not found',{status:404});return proxy(request,`/api/v1/auth/${action}`)}
