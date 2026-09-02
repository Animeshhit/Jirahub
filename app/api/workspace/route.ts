import { proxy } from '@/lib/apiClient'
export async function POST(request:Request){return proxy(request,'/api/v1/workspace')}
