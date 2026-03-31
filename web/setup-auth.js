const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs'); // Need to ensure bcryptjs is installed or install it

async function setupAuth() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'treetech_db',
        port: parseInt(process.env.DB_PORT || '3306')
    });

    try {
        console.log('Connected to database.');

        // Create users table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(191) PRIMARY KEY,
        email VARCHAR(191) UNIQUE NOT NULL,
        password_hash VARCHAR(191) NOT NULL,
        role ENUM('Owner', 'HR', 'Admin') NOT NULL DEFAULT 'HR',
        name VARCHAR(191),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('Users table checked/created.');

        // Seed Users
        const users = [
            {
                id: 'user_owner_1',
                email: 'owner@treetech.com',
                password: 'temproarypass',
                role: 'Owner',
                name: 'Owner'
            },
            {
                id: 'user_admin_1',
                email: 'Admin@treetech.com',
                password: 'adminiwanttocheckproblem',
                role: 'Admin',
                name: 'Admin'
            }
        ];

        for (const user of users) {
            // Check if user exists
            const [rows] = await connection.execute('SELECT id FROM users WHERE email = ?', [user.email]);

            if (rows.length === 0) {
                // Hash password (using a placeholder hash function if bcrypt not effective in this script context, 
                // but we should try to use a real one. We will use a simple logical step: 
                // Since we can't easily npm install inside this specific environment without user permission,
                // we will ask user to install bcryptjs or usage a separate action.
                // ACTUALLY, I can run npm install via run_command.
                // For now, let's assume I will run npm install bcryptjs next.
                // Let's rely on a helper or just do it here if possible.

                // Wait, I don't have bcryptjs installed yet. I should install it first.
                // I'll proceed with writing the script, but I'll need to run npm install bcryptjs first.

                // Simplified for now: writing without execution yet regarding hash.
                // I will use a placeholder and then update it, or better:
                // I'll install bcryptjs in the next step, then run this.

                // Let's use 'bcryptjs' require assuming it will be there.
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(user.password, salt);

                await connection.execute(
                    'INSERT INTO users (id, email, password_hash, role, name) VALUES (?, ?, ?, ?, ?)',
                    [user.id, user.email, hash, user.role, user.name]
                );
                console.log(`Created user: ${user.email}`);
            } else {
                console.log(`User already exists: ${user.email}`);
                // Optional: Update password if needed? For now, skip.
            }
        }

    } catch (error) {
        console.error('Error setup auth:', error);
    } finally {
        await connection.end();
    }
}

setupAuth();
