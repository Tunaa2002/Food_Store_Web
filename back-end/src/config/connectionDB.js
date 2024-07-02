import pkg from 'pg';

const { Pool } = pkg;

class connectionDB {
  constructor() {
    this.pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'FoodStore',
      password: '123456789',
      port: 5432,
    });
  }

  async connect() {
    try {
      const client = await this.pool.connect();
      console.log('PostgreSQL connected successfully');
      client.release();
    } catch (error) {
      console.error('Error connecting to PostgreSQL:', error.message);
      process.exit(1);
    }
  }

  getPool() {
    return this.pool;
  }
}

const ConnectionDB = new connectionDB();
export default ConnectionDB;
