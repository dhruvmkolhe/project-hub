import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { registerSchema } from '$lib/validation';
import { hashPassword, createSession } from '$lib/server/auth';
import { eq } from 'drizzle-orm';

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const data = {
            email: formData.get('email') as string,
            username: formData.get('username') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirmPassword') as string
        };

        // Validate input
        const result = registerSchema.safeParse(data);
        if (!result.success) {
            const errors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                if (err.path[0]) {
                    errors[err.path[0] as string] = err.message;
                }
            });
            return fail(400, {
                errors,
                email: data.email,
                username: data.username
            });
        }

        try {
            // Check if email already exists
            const existingEmail = await db.select()
                .from(users)
                .where(eq(users.email, data.email))
                .limit(1);

            if (existingEmail.length > 0) {
                return fail(400, {
                    error: 'An account with this email already exists',
                    email: data.email,
                    username: data.username
                });
            }

            // Check if username already exists
            const existingUsername = await db.select()
                .from(users)
                .where(eq(users.username, data.username))
                .limit(1);

            if (existingUsername.length > 0) {
                return fail(400, {
                    error: 'This username is already taken',
                    email: data.email,
                    username: data.username
                });
            }

            // Create user
            const passwordHash = await hashPassword(data.password);
            const [newUser] = await db.insert(users)
                .values({
                    email: data.email,
                    username: data.username,
                    passwordHash,
                    displayName: data.username
                })
                .returning({ id: users.id });

            // Create session
            const token = await createSession(newUser.id);

            cookies.set('session', token, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });
        } catch (error) {
            console.error('Registration error:', error);
            return fail(500, {
                error: 'Something went wrong. Please try again.',
                email: data.email,
                username: data.username
            });
        }

        throw redirect(303, '/dashboard');
    }
};
