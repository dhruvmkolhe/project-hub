import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { User } from '$lib/server/db/schema';
import { loginSchema } from '$lib/validation';
import { verifyPassword, createSession } from '$lib/server/auth';
import { checkRateLimit, sanitizeText } from '$lib/server/security';

export const actions: Actions = {
    default: async ({ request, cookies, getClientAddress }) => {
        const clientIp = getClientAddress() || 'unknown';
        const rateCheck = checkRateLimit(`login:${clientIp}`, 10, 60 * 1000);

        if (!rateCheck.success) {
            return fail(429, { error: 'Too many login attempts. Please wait a minute before trying again.' });
        }

        const formData = await request.formData();
        const rawEmail = formData.get('email');
        const rawPassword = formData.get('password');

        if (typeof rawEmail !== 'string' || typeof rawPassword !== 'string') {
            return fail(400, { error: 'Invalid input format' });
        }

        const data = {
            email: sanitizeText(rawEmail).toLowerCase(),
            password: rawPassword
        };

        // Validate input schema
        const result = loginSchema.safeParse(data);
        if (!result.success) {
            return fail(400, {
                error: 'Please enter a valid email and password',
                email: data.email
            });
        }

        try {
            // Find user using parameterized string primitive query (Mongo injection prevention)
            const user = await db.collection<User>('users').findOne({ email: String(data.email) });

            if (!user) {
                return fail(400, {
                    error: 'Invalid email or password',
                    email: data.email
                });
            }

            // Verify password
            const validPassword = await verifyPassword(data.password, user.passwordHash);
            if (!validPassword) {
                return fail(400, {
                    error: 'Invalid email or password',
                    email: data.email
                });
            }

            // Create session
            const token = await createSession(user.id);

            // Set secure, HttpOnly, SameSite cookie
            cookies.set('session', token, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });
        } catch (error) {
            console.error('Login error:', error);
            return fail(500, {
                error: 'Something went wrong. Please try again.',
                email: data.email
            });
        }

        throw redirect(303, '/dashboard');
    }
};
