import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set({ name, value, ...options })
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid using getSession() in middleware because it does not validate against Supabase server.
    // Use getUser() instead and handle invalid refresh tokens gracefully.
    let user = null
    try {
        const { data, error } = await supabase.auth.getUser()
        if (error) {
            // If the refresh token is missing or invalid, clear all corrupted auth cookies
            const isRefreshTokenError =
                error.message?.includes('Refresh Token') ||
                error.message?.includes('refresh_token_not_found') ||
                (error as { code?: string }).code === 'refresh_token_not_found'

            if (isRefreshTokenError) {
                request.cookies.getAll().forEach((cookie) => {
                    if (cookie.name.includes('-auth-token')) {
                        response.cookies.delete(cookie.name)
                    }
                })
                await supabase.auth.signOut().catch(() => {})
            }
        } else {
            user = data.user
        }
    } catch {
        // Fallback for network or parsing errors
        request.cookies.getAll().forEach((cookie) => {
            if (cookie.name.includes('-auth-token')) {
                response.cookies.delete(cookie.name)
            }
        })
    }

    const path = request.nextUrl.pathname

    // PROTECTED ROUTES: /admin/* (except /admin/login) AND /account
    if ((path.startsWith('/admin') && !path.startsWith('/admin/login')) || path.startsWith('/account')) {
        if (!user) {
            const loginUrl = path.startsWith('/admin') ? '/admin/login' : '/login'
            const redirectUrl = new URL(loginUrl, request.url)
            redirectUrl.searchParams.set('redirectedFrom', path)
            return NextResponse.redirect(redirectUrl)
        }
    }

    // PUBLIC AUTH ROUTES: /admin/login
    if (path.startsWith('/admin/login')) {
        if (user) {
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
