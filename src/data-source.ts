// src/data-source.ts
import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Notification } from "./entity/Notification";
import { POI } from "./entity/POI";
import { Program } from "./entity/Program";
import { SecurityInfo } from "./entity/SecurityInfo";
import { User } from "./entity/User";
import { Content } from "./entity/Content";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // Passez à false en production
  logging: false,
  entities: [User, Program, Notification, POI, SecurityInfo, Content],
  migrations: [],
  subscribers: [],
});
