// src/data-source.ts
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { Concert } from './entity/Concert';
import { Day } from './entity/Day';
import { POI } from './entity/POI';
import { SecurityInfo } from './entity/SecurityInfo';
import { User } from './entity/User';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

// Configuration pour les tests (MySQL)
const testOptions: MysqlConnectionOptions = {
  type: 'mysql',
  url: process.env.TEST_JAWSDB_MARIA_URL,
  synchronize: true,
  dropSchema: true,
  logging: false,
  entities: [User, Day, Concert, POI, SecurityInfo],
  ssl: {
    rejectUnauthorized: false,
  }
};

// Configuration pour la production / développement (MySQL)
const prodOptions: MysqlConnectionOptions = {
  type: 'mysql',
  url: process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || process.env.JAWSDB_MARIA_URL,
  synchronize: false, // Désactivé en production pour la sécurité
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Day, Concert, POI, SecurityInfo],
  migrations: ['src/migration/**/*.ts'],
  subscribers: [],
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    connectionLimit: 5,
    connectTimeout: 60000,
    acquireTimeout: 60000,
    timeout: 60000,
    keepAlive: true,
    waitForConnections: true,
    queueLimit: 0,
  },
  // Désactiver le dropSchema en production
  dropSchema: false,
};

const mysqlUrl = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || process.env.JAWSDB_MARIA_URL;
console.log("MySQL URL utilisée :", mysqlUrl?.replace(/:[^:]*@/, ':****@')); // Masquer le mot de passe dans les logs

// Sélection de la configuration selon l'environnement
const dataSourceOptions: DataSourceOptions = isTest
  ? testOptions
  : prodOptions;

export const AppDataSource = new DataSource(dataSourceOptions);