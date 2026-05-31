import bcrypt from 'bcryptjs';
import { db } from '../db';
import { randomBytes, randomUUID } from 'crypto';
import type { User, Session } from '../db/schema';

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

    const sessionId = randomUUID();

    await db.collection<Session>('sessions').insertOne({
        id: sessionId,
        userId,
        token,
        expiresAt,
        createdAt: new Date()
    });

    return token;
}

export async function validateSession(token: string) {
    const session = await db.collection<Session>('sessions').findOne({ token });

    if (!session) return null;

    if (new Date() > session.expiresAt) {
        await db.collection<Session>('sessions').deleteOne({ id: session.id });
        return null;
    }

    const user = await db.collection<User>('users').findOne(
        { id: session.userId },
        {
            projection: {
                _id: 0,
                id: 1,
                email: 1,
                username: 1,
                displayName: 1,
                avatarUrl: 1,
                isAdmin: 1
            }
        }
    );

    return user || null;
}

export async function deleteSession(token: string): Promise<void> {
    await db.collection<Session>('sessions').deleteOne({ token });
}

export async function deleteAllUserSessions(userId: string): Promise<void> {
    await db.collection<Session>('sessions').deleteMany({ userId });
}
