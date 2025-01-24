"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/index.ts
const express_1 = require("express");
const data_source_1 = require("../data-source");
const Concert_1 = require("../entity/Concert");
const Day_1 = require("../entity/Day");
const POI_1 = require("../entity/POI");
const SecurityInfo_1 = require("../entity/SecurityInfo");
const adminRoutes_1 = __importDefault(require("./adminRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const concertRoutes_1 = __importDefault(require("./concertRoutes"));
const dayRoutes_1 = __importDefault(require("./dayRoutes"));
const poiRoutes_1 = __importDefault(require("./poiRoutes"));
const securityInfoRoutes_1 = __importDefault(require("./securityInfoRoutes"));
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.use('/auth', authRoutes_1.default, middleware_1.authMiddleware);
router.use('/pois', poiRoutes_1.default);
router.use('/programs', dayRoutes_1.default);
router.use('/days', dayRoutes_1.default);
router.use('/concerts', concertRoutes_1.default);
router.use('/admin', adminRoutes_1.default, middleware_1.authMiddleware, middleware_1.adminMiddleware);
router.use('/securityInfos', securityInfoRoutes_1.default);
// Route pour récupérer toutes les données
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {
            days: yield data_source_1.AppDataSource.getRepository(Day_1.Day).find({
                relations: ['program', 'concerts'],
            }),
            concerts: yield data_source_1.AppDataSource.getRepository(Concert_1.Concert).find({
                relations: ['days'],
            }),
            pois: yield data_source_1.AppDataSource.getRepository(POI_1.POI).find(),
            securityInfos: yield data_source_1.AppDataSource.getRepository(SecurityInfo_1.SecurityInfo).find(),
        };
        res.status(200).json(data);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}));
exports.default = router;
