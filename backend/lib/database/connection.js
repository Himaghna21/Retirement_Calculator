import mysql from 'mysql2/promise.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Create a MySQL connection pool
 */
let pool = null;
let isMockStorage = false;

export const initializePool = async () => {
  if (pool || isMockStorage) {
    return pool;
  }

  try {
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
    
    // Test the connection immediately
    const connection = await pool.getConnection();
    connection.release();

    console.log('Database pool initialized');
    return pool;
  } catch (error) {
    console.warn('⚠️ MySQL connection failed:', error.message);
    console.warn('⚠️ Falling back to Mock Storage Mode. Session data will not be saved.');
    isMockStorage = true;
    pool = null; // Ensure pool is null in mock mode
    return null;
  }
};

/**
 * Get a connection from the pool
 */
export const getConnection = async () => {
  const pool_ = await initializePool();
  if (isMockStorage || !pool_) {
    // Return a dummy connection object for mock mode
    return {
      execute: async () => [[{ insertId: 1 }]],
      release: () => {},
    };
  }
  return pool_.getConnection();
};

/**
 * Close the connection pool
 */
export const closePool = async () => {
  if (pool && !isMockStorage) {
    await pool.end();
    pool = null;
    console.log('Database pool closed');
  }
};

/**
 * Execute a query (for one-off queries or without needing explicit connection management)
 */
export const executeQuery = async (sql, params = []) => {
  if (isMockStorage) {
    // Return dummy results matching expected query structures
    return { insertId: 1, length: 0 };
  }
  
  const connection = await getConnection();
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.release();
  }
};