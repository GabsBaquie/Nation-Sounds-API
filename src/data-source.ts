// src/data-source.ts
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Concert } from './entity/Concert';
import { Day } from './entity/Day';
import { POI } from './entity/POI';
import { SecurityInfo } from './entity/SecurityInfo';
import { User } from './entity/User';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';

export const AppDataSource = new DataSource({
  type: "mysql",
  url: isTest ? process.env.TEST_JAWSDB_MARIA_URL : process.env.JAWSDB_MARIA_URL,
  synchronize: isTest, // Désactivé pour éviter des recréations non contrôlées
  dropSchema: false, // Désactivé pour éviter des suppressions involontaires
  logging: process.env.NODE_ENV === "development",
  ssl: isTest
    ? false
    : {
        rejectUnauthorized: false,
      },
  entities: [
    User,
    Day,
    Concert,
    POI,
    SecurityInfo,
  ],
  migrations: ['src/migration/**/*.ts'],
  subscribers: [],
});