import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Create Supabase client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // Refresh session if expired
    const { data: { session } } = await supabase.auth.getSession()

    const path = request.nextUrl.pathname

    // PROTECTED ROUTES: /admin/* (except /admin/login) AND /account
    if ((path.startsWith('/admin') && !path.startsWith('/admin/login')) || path.startsWith('/account')) {
        if (!session) {
            // Determine redirect URL based on path
            const loginUrl = path.startsWith('/admin') ? '/admin/login' : '/login';
            const redirectUrl = new URL(loginUrl, request.url);
            redirectUrl.searchParams.set('redirectedFrom', path);
            return NextResponse.redirect(redirectUrl);
        }
    }

    // PUBLIC AUTH ROUTES: /admin/login
    if (path.startsWith('/admin/login')) {
        if (session) {
            // If user is already logged in, redirect to dashboard
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/account/:path*',
    ],
}
