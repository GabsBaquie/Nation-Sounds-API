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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
// src/data-source.ts
const dotenv = __importStar(require("dotenv"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Concert_1 = require("./entity/Concert");
const Content_1 = require("./entity/Content");
const Day_1 = require("./entity/Day");
const Notification_1 = require("./entity/Notification");
const POI_1 = require("./entity/POI");
const Program_1 = require("./entity/Program");
const SecurityInfo_1 = require("./entity/SecurityInfo");
const User_1 = require("./entity/User");
dotenv.config();
// Ajoutez cette ligne pour vérifier
console.log('DATABASE_URL:', process.env.DATABASE_URL);
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: process.env.NODE_ENV !== "production",
    logging: process.env.NODE_ENV === "development",
    ssl: {
        rejectUnauthorized: false, // Ignore la vérification du certificat
    },
    entities: [
        User_1.User,
        Program_1.Program,
        Day_1.Day,
        Concert_1.Concert,
        Notification_1.Notification,
        POI_1.POI,
        SecurityInfo_1.SecurityInfo,
        Content_1.Content,
    ],
    migrations: [],
    subscribers: [],
});
