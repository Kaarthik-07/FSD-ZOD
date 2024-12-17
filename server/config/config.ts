import dotenv from 'dotenv';
dotenv.config();
import { Pool, PoolConfig } from 'pg';
const pool_config: PoolConfig = {
  user: process.env.DB_USER || '',
  host: process.env.DB_HOST || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || '',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  idleTimeoutMillis: 20000,
  max: 12
};

export const pool = new Pool(pool_config);

const checkDbConnection = async () => {
  try {
    const client = await pool.connect(); // Try to get a client from the pool
    console.log('Database connection established successfully!');
    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error('Error connecting to the database:', err);
  }
};

checkDbConnection();
