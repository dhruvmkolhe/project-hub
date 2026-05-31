import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { User } from '$lib/server/db/schema';
import { loginSchema } from '$lib/validation';
import { verifyPassword, createSession } from '$lib/server/auth';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const data = {
            email: formData.get('email') as string,
            password: formData.get('password') as string
        };

        // Validate input
        const result = loginSchema.safeParse(data);
        if (!result.success) {
            return fail(400, {
                error: 'Please enter a valid email and password',
                email: data.email
            });
        }

        try {
            // Find user
            const user = await db.collection<User>('users').findOne({ email: data.email });

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
