"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
// src/data-source.ts
const dotenv = __importStar(require("dotenv"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Concert_1 = require("./entity/Concert");
const Day_1 = require("./entity/Day");
const POI_1 = require("./entity/POI");
const SecurityInfo_1 = require("./entity/SecurityInfo");
const User_1 = require("./entity/User");
dotenv.config();
const isTest = process.env.NODE_ENV === 'test';
// Configuration pour les tests (MySQL)
const testOptions = {
    type: 'mysql',
    url: process.env.TEST_JAWSDB_MARIA_URL,
    synchronize: true,
    dropSchema: true,
    logging: false,
    entities: [User_1.User, Day_1.Day, Concert_1.Concert, POI_1.POI, SecurityInfo_1.SecurityInfo],
    ssl: {
        rejectUnauthorized: false,
    }
};
// Configuration pour la production / développement (MySQL)
const prodOptions = {
    type: 'mysql',
    url: process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || process.env.JAWSDB_MARIA_URL,
    synchronize: false, // Désactivé en production pour la sécurité
    logging: process.env.NODE_ENV === 'development',
    entities: [User_1.User, Day_1.Day, Concert_1.Concert, POI_1.POI, SecurityInfo_1.SecurityInfo],
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
console.log("MySQL URL utilisée :", mysqlUrl === null || mysqlUrl === void 0 ? void 0 : mysqlUrl.replace(/:[^:]*@/, ':****@')); // Masquer le mot de passe dans les logs
// Sélection de la configuration selon l'environnement
const dataSourceOptions = isTest
    ? testOptions
    : prodOptions;
exports.AppDataSource = new typeorm_1.DataSource(dataSourceOptions);
