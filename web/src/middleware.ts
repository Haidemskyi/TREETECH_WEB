import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/auth-lib';
import { decrypt } from './lib/auth-lib';

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;

    // Protect /recruiting routes
    if (request.nextUrl.pathname.startsWith('/recruiting')) {
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Optional: Check validity of session token
        try {
            const payload = await decrypt(session);
            if (!payload) throw new Error("Invalid token");
        } catch (e) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Redirect /login to /recruiting if already logged in
    if (request.nextUrl.pathname.startsWith('/login')) {
        if (session) {
            try {
                await decrypt(session);
                return NextResponse.redirect(new URL('/recruiting', request.url));
            } catch (e) {
                // invalid session, let them login
            }
        }
    }

    return await updateSession(request);
}

export const config = {
    matcher: ['/recruiting/:path*', '/login'],
};
