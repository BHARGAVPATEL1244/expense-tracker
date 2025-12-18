import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    // If no password set, assume public (or handle as you see fit)
    if (!process.env.APP_PASSWORD) return NextResponse.next();

    const session = request.cookies.get("session")?.value;

    let isAuthenticated = false;
    if (session) {
        try {
            const payload = await decrypt(session);
            if (payload?.expires && new Date(payload.expires) > new Date()) {
                isAuthenticated = true;
            }
        } catch (e) { }
    }

    // Dashboard/Protected Routes
    const isProtectedRoute =
        request.nextUrl.pathname.startsWith('/dashboard') ||
        request.nextUrl.pathname.startsWith('/transactions') ||
        request.nextUrl.pathname.startsWith('/profiles') ||
        (request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.startsWith('/api/auth'));

    if (isProtectedRoute && !isAuthenticated) {
        if (request.nextUrl.pathname.startsWith('/api')) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // If already logged in and visiting /login, redirect to dashboard
    if (request.nextUrl.pathname === '/login' && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
