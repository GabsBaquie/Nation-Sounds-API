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
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../data-source");
const POI_1 = require("../entity/POI");
class PoiController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const poiRepository = data_source_1.AppDataSource.getRepository(POI_1.POI);
            const type = req.query.type;
            let pois;
            if (type) {
                pois = yield poiRepository.find({ where: { type } });
            }
            else {
                pois = yield poiRepository.find();
            }
            res.json(pois);
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const poiRepository = data_source_1.AppDataSource.getRepository(POI_1.POI);
            const id = parseInt(req.params.id);
            try {
                const poi = yield poiRepository.findOneOrFail({ where: { id } });
                res.json(poi);
            }
            catch (error) {
                res.status(404).json({ message: "Point d’intérêt non trouvé" });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const poiRepository = data_source_1.AppDataSource.getRepository(POI_1.POI);
            const { name, type, latitude, longitude, description } = req.body;
            const poi = poiRepository.create({
                title: name,
                type,
                latitude,
                longitude,
                description
            });
            try {
                yield poiRepository.save(poi);
                res.status(201).json(poi);
            }
            catch (error) {
                res.status(400).json({ message: "Erreur lors de la création du point d’intérêt" });
            }
        });
    }
}
exports.default = PoiController;
