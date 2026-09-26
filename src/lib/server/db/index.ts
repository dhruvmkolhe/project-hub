import { MongoClient, type Db } from 'mongodb';
import { DATABASE_URL as STATIC_DATABASE_URL } from '$env/static/private';
import dns from 'dns';

// Fix Node.js SRV DNS resolution for MongoDB Atlas across Windows / Serverless
try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

let client: MongoClient | null = null;
let dbConnection: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
    if (dbConnection) return dbConnection;

    const connectionString = process.env.DATABASE_URL || STATIC_DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is missing.');
    }

    if (!client) {
        client = new MongoClient(connectionString);
    }

    await client.connect();
    dbConnection = client.db();
    return dbConnection;
}

export const db = {
    collection: <T = any>(name: string) => {
        if (!dbConnection) {
            throw new Error("Database not connected. Call connectToDatabase() first.");
        }
        return dbConnection.collection<T>(name);
    }
};

export type Database = typeof db;
