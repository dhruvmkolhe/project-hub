import type { Handle, HandleServerError } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import { connectToDatabase } from '$lib/server/db';

export const handle: Handle = async ({ event, resolve }) => {
    // Ensure database connection is active
    await connectToDatabase();

    const sessionToken = event.cookies.get('session');

    if (sessionToken && typeof sessionToken === 'string') {
        const user = await validateSession(sessionToken);
        event.locals.user = user;
    } else {
        event.locals.user = null;
    }

    const response = await resolve(event);

    // Security Headers Configuration
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; object-src 'none';"
    );

    // Enforce HSTS header in production environments
    if (process.env.NODE_ENV === 'production') {
        response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }

    return response;
};

// App-Level Error Handling: Prevent leaking database stack traces to clients in production
export const handleError: HandleServerError = ({ error, event }) => {
    console.error(`[SERVER ERROR] ${event.request.method} ${event.url.pathname}:`, error);

    return {
        message: process.env.NODE_ENV === 'production' 
            ? 'An unexpected server error occurred. Please try again later.' 
            : (error as Error)?.message || 'Internal Server Error'
    };
};
