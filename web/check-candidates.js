const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function main() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    const [rows] = await connection.query('SELECT * FROM Candidate ORDER BY createdAt DESC');
    console.log('Candidates found:', rows.length);
    console.log(JSON.stringify(rows, null, 2));

    await connection.end();
}

main();
