import { proxy } from '@/lib/apiClient'
export async function POST(request:Request,{params}:{params:Promise<{id:string;action:string}>}){const {id,action}=await params;if(!['accept','decline'].includes(action))return new Response('Not found',{status:404});return proxy(request,`/api/v1/invites/${encodeURIComponent(id)}/${action}`)}
