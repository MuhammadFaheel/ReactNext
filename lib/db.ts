import sql from 'mssql';

const config: sql.config = {
  server: 'localhost',
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection() {
  if (!pool || !pool.connected) {
    pool = new sql.ConnectionPool(config);
    await pool.connect();
    console.log('✅ DB connected');
  }
  return pool;
}