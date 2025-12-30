const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'promptly_db'}`);
    await connection.query(`USE ${process.env.DB_NAME || 'promptly_db'}`);

    // Read and execute schema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await connection.query(schema);
    console.log('✅ Database schema created successfully');
    
    // Run seed data if exists
    const seedPath = path.join(__dirname, '../database/seed.sql');
    if (fs.existsSync(seedPath)) {
      const seed = fs.readFileSync(seedPath, 'utf8');
      await connection.query(seed);
      console.log('✅ Seed data inserted successfully');
    }
    
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

runMigrations();

