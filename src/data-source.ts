import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { Concert } from "./entity/Concert";
import { Day } from "./entity/Day";
import { POI } from "./entity/POI";
import { SecurityInfo } from "./entity/SecurityInfo";
import { User } from "./entity/User";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.docker" });
  console.log("Chargement de .env.docker");
} else {
  dotenv.config();
  console.log("Chargement de .env");
}

const isDocker = process.env.IS_DOCKER === "true";

// Détection intelligente de l'URL de base de données
const postgresUrl = isDocker
  ? process.env.POSTGRES_URL_DOCKER
  : process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

console.log(
  "PostgreSQL URL utilisée :",
  postgresUrl?.replace(/:[^:]*@/, ":****@")
);

// Log la valeur de NODE_ENV
console.log("NODE_ENV:", process.env.NODE_ENV);

// isDev = true seulement si NODE_ENV === "development", sinon prod par défaut
const isDev = process.env.NODE_ENV === "development";
console.log("isDev:", isDev);

// Configuration TypeORM
const postgresOptions: DataSourceOptions = {
  type: "postgres",
  url: postgresUrl,
  synchronize: false, // À garder désactivé en production
  logging: isDev,
  entities: [User, Day, Concert, POI, SecurityInfo],
  migrations: [isDev ? "src/migration/*.ts" : "dist/migration/*.js"],
  subscribers: [],
  ssl: false, // À activer si tu te connectes à une BDD distante sécurisée
};

console.log("Migrations chargées :", postgresOptions.migrations);

// Log de vérification (mot de passe masqué)

export const AppDataSource = new DataSource(postgresOptions);
