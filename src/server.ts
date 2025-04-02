// server.ts
import express from 'express';
import { DataSource } from 'typeorm';
import authRoute from './routes/auth.routes';
import errorMiddleware from './middlewares/error.middleware';
import dotenv from 'dotenv';
import { Client } from 'pg';
import cors from 'cors';
import databaseConfig from './config/db';


dotenv.config();
const app = express();
const AppDataSource = new DataSource(databaseConfig);



async function createDatabaseIfNotExists() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres', 
  });

  try {
    await client.connect();
    const dbName = process.env.DB_NAME || 'ventry'; 
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`); 
      console.log(`Database '${dbName}' created successfully`);
    } else {
      console.log(`Database '${dbName}' already exists`);
    }
  } catch (err) {
    console.error('Error creating database:', err);
    throw err;
  } finally {
    await client.end();
  }
}

async function startServer() {
  try {
    await createDatabaseIfNotExists();
    
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    app.use(express.json());
    app.use(cors());

    app.use('/api/v1/auth', authRoute);

    app.use(errorMiddleware);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during DataSource initialization:', error);
    process.exit(1);
  }
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer();