"use strict";
// // src/orcconfig.ts
// import { DataSource } from "typeorm";
// import { Notification } from "./entity/Notification";
// import { POI } from "./entity/POI";
// import { Program } from "./entity/Program";
// import { SecurityInfo } from "./entity/SecurityInfo";
// import { User } from "./entity/User";
// import { Content } from "./entity/Content";
// import { Day } from "./entity/Day";
// import { Concert } from "./entity/Concert";
// import * as dotenv from "dotenv";
// dotenv.config();
// export const AppDataSource = new DataSource({
//   type: "mysql",
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   synchronize: true, // Set to false in production
//   logging: false,
//   entities: [
//     User,
//     Program,
//     Day,
//     Concert,
//     Notification,
//     POI,
//     SecurityInfo,
//     Content,
//   ],
//   migrations: ["src/migration/**/*.ts"],
//   subscribers: ["src/subscriber/**/*.ts"],
// });
// AppDataSource.initialize()
//   .then(() => {
//     console.log("Data Source has been initialized!");
//   })
//   .catch((err) => {
//     console.error("Error during Data Source initialization:", err);
//   });
