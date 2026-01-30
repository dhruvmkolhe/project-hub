import postgres from 'postgres';

// Connect to default postgres database to create projecthub
const sql = postgres('postgres://postgres: @localhost:5432/postgres');

async function createDatabase() {
    try {
        // Check if database exists
        const result = await sql`SELECT 1 FROM pg_database WHERE datname = 'projecthub'`;

        if (result.length === 0) {
            console.log('Creating projecthub database...');
            await sql.unsafe('CREATE DATABASE projecthub');
            console.log('✅ Database created successfully!');
        } else {
            console.log('Database projecthub already exists.');
        }
    } catch (error: any) {
        if (error.code === '42P04') {
            console.log('Database projecthub already exists.');
        } else {
            console.error('Error:', error.message);
        }
    } finally {
        await sql.end();
    }
}

createDatabase();
