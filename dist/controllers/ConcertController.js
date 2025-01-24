"use strict";
// src/controllers/ConcertController.ts
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
const Concert_1 = require("../entity/Concert");
const class_validator_1 = require("class-validator");
class ConcertController {
    // GET /api/concerts
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const concertRepository = data_source_1.AppDataSource.getRepository(Concert_1.Concert);
                const concerts = yield concertRepository.find({ relations: ["days"] });
                return res.status(200).json(concerts);
            }
            catch (error) {
                console.error("Erreur lors de la récupération des concerts:", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
    // GET /api/concerts/:id
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const concertId = parseInt(req.params.id);
            try {
                const concertRepository = data_source_1.AppDataSource.getRepository(Concert_1.Concert);
                const concert = yield concertRepository.findOne({
                    where: { id: concertId },
                    relations: ["days"],
                });
                if (!concert) {
                    return res.status(404).json({ message: "Concert non trouvé" });
                }
                return res.status(200).json(concert);
            }
            catch (error) {
                console.error("Erreur lors de la récupération du concert:", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
    // POST /api/concerts
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const concertRepository = data_source_1.AppDataSource.getRepository(Concert_1.Concert);
                const { title, description, performer, time, location, image, days } = req.body;
                const concert = concertRepository.create({
                    title,
                    description,
                    performer,
                    time,
                    location,
                    image,
                    days,
                });
                const errors = yield (0, class_validator_1.validate)(concert);
                if (errors.length > 0) {
                    return res.status(400).json(errors);
                }
                yield concertRepository.save(concert);
                return res.status(201).json(concert);
            }
            catch (error) {
                console.error("Erreur lors de la création du concert:", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
    // PUT /api/concerts/:id
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const concertId = parseInt(req.params.id);
            try {
                const concertRepository = data_source_1.AppDataSource.getRepository(Concert_1.Concert);
                let concert = yield concertRepository.findOne({
                    where: { id: concertId },
                    relations: ["days"],
                });
                if (!concert) {
                    return res.status(404).json({ message: "Concert non trouvé" });
                }
                concertRepository.merge(concert, req.body);
                const errors = yield (0, class_validator_1.validate)(concert);
                if (errors.length > 0) {
                    return res.status(400).json(errors);
                }
                const results = yield concertRepository.save(concert);
                return res.status(200).json(results);
            }
            catch (error) {
                console.error("Erreur lors de la mise à jour du concert:", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
    // DELETE /api/concerts/:id
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const concertId = parseInt(req.params.id);
            try {
                const concertRepository = data_source_1.AppDataSource.getRepository(Concert_1.Concert);
                const result = yield concertRepository.delete(concertId);
                if (result.affected === 1) {
                    return res
                        .status(200)
                        .json({ message: "Concert supprimé avec succès" });
                }
                else {
                    return res.status(404).json({ message: "Concert non trouvé" });
                }
            }
            catch (error) {
                console.error("Erreur lors de la suppression du concert:", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
}
exports.default = ConcertController;
