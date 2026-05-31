import { MongoClient, type Db } from 'mongodb';
import { DATABASE_URL } from '$env/static/private';

const client = new MongoClient(DATABASE_URL);
let dbConnection: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
    if (dbConnection) return dbConnection;
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
