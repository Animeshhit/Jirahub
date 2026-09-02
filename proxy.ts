import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export function proxy(request:NextRequest){const token=request.cookies.get('accessToken')?.value;const path=request.nextUrl.pathname;const protectedPath=path==='/onboarding'||path.startsWith('/dashboard');const authPage=path==='/login'||path==='/register';if(protectedPath&&!token)return NextResponse.redirect(new URL('/login',request.url));if(authPage&&token)return NextResponse.redirect(new URL('/onboarding',request.url));return NextResponse.next()}
export const config={matcher:['/login','/register','/onboarding','/dashboard/:path*']}
