import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Create a MySQL connection pool
 */
let pool = null;

export const initializePool = async () => {
  if (pool) {
    return pool;
  }

  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'retirement_calculator',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelayMs: 0,
  });

  console.log('Database pool initialized');
  return pool;
};

/**
 * Get a connection from the pool
 */
export const getConnection = async () => {
  const pool_ = await initializePool();
  return pool_.getConnection();
};

/**
 * Close the connection pool
 */
export const closePool = async () => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database pool closed');
  }
};

/**
 * Execute a query (for one-off queries or without needing explicit connection management)
 */
export const executeQuery = async (sql, params = []) => {
  const connection = await getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.release();
  }
};