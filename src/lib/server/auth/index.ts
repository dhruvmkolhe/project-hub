import bcrypt from 'bcryptjs';
import { db } from '../db';
import { users, sessions } from '../db/schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

const SALT_ROUNDS = 10;
const SESSION_DURATION_DAYS = 7;

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
    return randomBytes(32).toString('hex');
}

export async function createSession(userId: string): Promise<string> {
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000);

    await db.insert(sessions).values({
        userId,
        token,
        expiresAt
    });

    return token;
}

export async function validateSession(token: string) {
    const [session] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.token, token));

    if (!session) return null;

    if (new Date() > session.expiresAt) {
        await db.delete(sessions).where(eq(sessions.id, session.id));
        return null;
    }

    const [user] = await db
        .select({
            id: users.id,
            email: users.email,
            username: users.username,
            displayName: users.displayName,
            avatarUrl: users.avatarUrl,
            isAdmin: users.isAdmin
        })
        .from(users)
        .where(eq(users.id, session.userId));

    return user || null;
}

export async function deleteSession(token: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.token, token));
}

export async function deleteAllUserSessions(userId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId));
}
