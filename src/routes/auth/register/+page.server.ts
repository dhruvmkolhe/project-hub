import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { User } from '$lib/server/db/schema';
import { registerSchema } from '$lib/validation';
import { hashPassword, createSession } from '$lib/server/auth';
import { randomUUID } from 'crypto';

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
            const existingEmail = await db.collection<User>('users').findOne({ email: data.email });

            if (existingEmail) {
                return fail(400, {
                    error: 'An account with this email already exists',
                    email: data.email,
                    username: data.username
                });
            }

            // Check if username already exists
            const existingUsername = await db.collection<User>('users').findOne({ username: data.username });

            if (existingUsername) {
                return fail(400, {
                    error: 'This username is already taken',
                    email: data.email,
                    username: data.username
                });
            }

            // Create user
            const passwordHash = await hashPassword(data.password);
            const userId = randomUUID();
            const now = new Date();

            await db.collection<User>('users').insertOne({
                id: userId,
                email: data.email,
                username: data.username,
                passwordHash,
                displayName: data.username,
                avatarUrl: null,
                bio: null,
                githubUsername: null,
                isAdmin: false,
                createdAt: now,
                updatedAt: now
            });

            // Create session
            const token = await createSession(userId);

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

