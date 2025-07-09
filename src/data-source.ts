import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { Concert } from "./entity/Concert";
import { Day } from "./entity/Day";
import { POI } from "./entity/POI";
import { SecurityInfo } from "./entity/SecurityInfo";
import { User } from "./entity/User";

dotenv.config();

// Ajoute ce log juste après dotenv.config()
console.log("DEBUG DATABASE_URL:", process.env.DATABASE_URL);

const isDocker = process.env.IS_DOCKER === "true";

// Détection intelligente de l'URL de base de données
const postgresUrl = isDocker
  ? process.env.POSTGRES_URL_DOCKER
  : process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

console.log(
  "PostgreSQL URL utilisée :",
  postgresUrl?.replace(/:[^:]*@/, ":****@")
);

const isDev = process.env.NODE_ENV === "development";

// Configuration TypeORM
const postgresOptions: DataSourceOptions = {
  type: "postgres",
  url: postgresUrl,
  synchronize: false, // À garder désactivé en production
  logging: isDev,
  entities: [User, Day, Concert, POI, SecurityInfo],
  migrations: [isDev ? "src/migration/*.ts" : __dirname + "/migration/*.js"],
  subscribers: [],
  ssl: false, // À activer si tu te connectes à une BDD distante sécurisée
};

console.log("Migrations chargées :", postgresOptions.migrations);

// Log de vérification (mot de passe masqué)

export const AppDataSource = new DataSource(postgresOptions);
