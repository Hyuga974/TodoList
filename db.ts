import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: process.env.DATABASE_HOST ,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function testConnection() {
  try {
    // Execute a simple query to check the connection
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    console.log('Database connection successful. Query result:', rows);

  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    // Close the connection
    await db.end();
  }
}

