import { DataSourceOptions } from 'typeorm';

console.log('==============__dirname======================');
console.log(__dirname);
console.log('============__dirname========================');

const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'ventry',
  synchronize: process.env.NODE_ENV !== 'production', 
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + '/entities/**/*.ts'], 
  subscribers: [__dirname + '/subscribers/**/*.ts'], 
};

export default databaseConfig;