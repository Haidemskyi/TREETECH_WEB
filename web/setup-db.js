const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function main() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        // Do not specify database yet to allow connecting to create it
        multipleStatements: true
    });

    const sql = `
    CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};
    USE ${process.env.DB_NAME};

    CREATE TABLE IF NOT EXISTS Candidate (
        id VARCHAR(191) PRIMARY KEY,
        name VARCHAR(191) NOT NULL,
        email VARCHAR(191),
        phone VARCHAR(191),
        status VARCHAR(191) DEFAULT 'New',
        source VARCHAR(191),
        notes TEXT,
        age INT,
        documents TEXT,
        commissionValue DECIMAL(65, 30) DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS CandidateHistory (
        id VARCHAR(191) PRIMARY KEY,
        candidateId VARCHAR(191) NOT NULL,
        event VARCHAR(191) NOT NULL,
        details TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidateId) REFERENCES Candidate (id) ON DELETE CASCADE
    );
  `;

    try {
        await connection.query(sql);
        console.log('Database schema updated successfully.');
    } catch (err) {
        console.error('Error updating schema:', err);
    } finally {
        await connection.end();
    }
}

main();
