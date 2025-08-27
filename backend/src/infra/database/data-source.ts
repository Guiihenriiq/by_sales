// src/infra/database/data-source.ts

import 'dotenv/config';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Product } from '@/domain/entities/product.entity'; // IMPORTAR A ENTIDADE

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [Product], // GARANTA QUE ESTA LINHA ESTEJA ASSIM
  migrations: [__dirname + '/typeorm/migrations/*.{js,ts}'],
};

export const AppDataSource = new DataSource(dataSourceOptions);