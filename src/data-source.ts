// src/data-source.ts
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Concert } from './entity/Concert';
import { Content } from './entity/Content';
import { Day } from './entity/Day';
import { Notification } from './entity/Notification';
import { POI } from './entity/POI';
import { Program } from './entity/Program';
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
    Program,
    Day,
    Concert,
    Notification,
    POI,
    SecurityInfo,
    Content,
  ],
  migrations: ['src/migration/**/*.ts'],
  subscribers: [],
});