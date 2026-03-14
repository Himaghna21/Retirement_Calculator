import mysql from 'mysql2/promise.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const MIGRATIONS_DIR = './lib/database/migrations';

async function runMigrations() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    });

    try {
        // Create database if it doesn't exist
        const dbName = process.env.DB_NAME || 'retirement_calculator';
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        console.log(`✓ Database ${dbName} created/verified`);

        // Switch to the database
        await connection.execute(`USE ${dbName}`);

        // Run migration files in order
        const migrationFiles = fs.readdirSync(MIGRATIONS_DIR).sort();

        for (const file of migrationFiles) {
            if (file.endsWith('.sql')) {
                const filePath = path.join(MIGRATIONS_DIR, file);
                const sql = fs.readFileSync(filePath, 'utf-8');

                // Split SQL statements by semicolon
                const statements = sql.split(';').filter((stmt) => stmt.trim());

                for (const statement of statements) {
                    await connection.execute(statement);
                }

                console.log(`✓ Migration ${file} completed`);
            }
        }

        console.log('\n✓ All migrations completed successfully');
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    } finally {
        await connection.end();
    }
}

// Run migrations
runMigrations();