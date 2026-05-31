import type { Handle } from '@sveltejs/kit';
import { validateSession } from '$lib/server/auth';
import { connectToDatabase } from '$lib/server/db';

export const handle: Handle = async ({ event, resolve }) => {
    // Ensure database connection is active
    await connectToDatabase();

    const sessionToken = event.cookies.get('session');

    if (sessionToken) {
        const user = await validateSession(sessionToken);
        event.locals.user = user;
    } else {
        event.locals.user = null;
    }

    const response = await resolve(event);
    return response;
};
