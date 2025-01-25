"use strict";
// src/controllers/DayController.ts
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
const class_validator_1 = require("class-validator");
const data_source_1 = require("../data-source");
const Day_1 = require("../entity/Day");
const Concert_1 = require("../entity/Concert");
class DayController {
    // GET /api/days
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dayRepository = data_source_1.AppDataSource.getRepository(Day_1.Day);
                const days = yield dayRepository.find({
                    relations: ['concerts'],
                });
                return res.status(200).json(days);
            }
            catch (error) {
                console.error('Erreur lors de la récupération des jours:', error);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    }
    // GET /api/days/:id
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dayId = parseInt(req.params.id);
            try {
                const dayRepository = data_source_1.AppDataSource.getRepository(Day_1.Day);
                const day = yield dayRepository.findOne({
                    where: { id: dayId },
                    relations: ['concerts'],
                });
                if (!day) {
                    return res.status(404).json({ message: 'Jour non trouvé' });
                }
                return res.status(200).json(day);
            }
            catch (error) {
                console.error('Erreur lors de la récupération du jour:', error);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    }
    // POST /api/days
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dayRepository = data_source_1.AppDataSource.getRepository(Day_1.Day);
                const concertRepository = data_source_1.AppDataSource.getRepository(Concert_1.Concert);
                const { title, date, concertIds } = req.body; // Utilisez 'concertIds' pour recevoir les IDs des concerts
                // Récupérer les concerts depuis la base de données
                const concerts = yield concertRepository.findByIds(concertIds);
                if (concerts.length !== concertIds.length) {
                    return res.status(404).json({ message: "Un ou plusieurs concerts n'ont pas été trouvés." });
                }
                // Créer le nouveau jour avec les concerts associés
                const day = dayRepository.create({ title, date, concerts });
                // Valider les données
                const errors = yield (0, class_validator_1.validate)(day);
                if (errors.length > 0) {
                    return res.status(400).json(errors);
                }
                // Enregistrer le jour dans la base de données
                yield dayRepository.save(day);
                return res.status(201).json(day);
            }
            catch (error) {
                console.error('Erreur lors de la création du jour avec concerts:', error);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    }
    // PUT /api/days/:id
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dayId = parseInt(req.params.id, 10);
            const { title, date, concertIds } = req.body; // Ajout de 'concertIds' optionnel
            if (isNaN(dayId)) {
                return res.status(400).json({ message: "ID de jour invalide" });
            }
            try {
                const dayRepository = data_source_1.AppDataSource.getRepository(Day_1.Day);
                const concertRepository = data_source_1.AppDataSource.getRepository(Concert_1.Concert);
                // Récupérer le jour avec ses concerts actuels
                const day = yield dayRepository.findOne({
                    where: { id: dayId },
                    relations: ['concerts'],
                });
                if (!day) {
                    return res.status(404).json({ message: "Jour non trouvé" });
                }
                // Mettre à jour les propriétés du jour
                if (title !== undefined)
                    day.title = title;
                if (date !== undefined)
                    day.date = date;
                // Si 'concertIds' est fourni, ajouter les concerts
                if (concertIds) {
                    if (!Array.isArray(concertIds)) {
                        return res.status(400).json({ message: "Les IDs des concerts doivent être un tableau." });
                    }
                    // Récupérer les concerts depuis la base de données
                    const concertsToAdd = yield concertRepository.findByIds(concertIds);
                    if (concertsToAdd.length !== concertIds.length) {
                        return res.status(404).json({ message: "Un ou plusieurs concerts n'ont pas été trouvés." });
                    }
                    // Éviter les doublons
                    const existingConcertIds = day.concerts.map(concert => concert.id);
                    const newConcerts = concertsToAdd.filter(concert => !existingConcertIds.includes(concert.id));
                    // Ajouter les nouveaux concerts
                    day.concerts = [...day.concerts, ...newConcerts];
                }
                // Valider les données
                const errors = yield (0, class_validator_1.validate)(day);
                if (errors.length > 0) {
                    return res.status(400).json(errors);
                }
                // Enregistrer les modifications
                yield dayRepository.save(day);
                return res.status(200).json(day);
            }
            catch (error) {
                console.error("Erreur lors de la mise à jour du jour:", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
    // DELETE /api/days/:id
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dayId = parseInt(req.params.id, 10);
            if (isNaN(dayId)) {
                return res.status(400).json({ message: "ID de jour invalide" });
            }
            const queryRunner = data_source_1.AppDataSource.createQueryRunner();
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                const dayRepository = queryRunner.manager.getRepository(Day_1.Day);
                const concertRepository = queryRunner.manager.getRepository(Concert_1.Concert);
                // Récupérer le Day avec ses concerts
                const day = yield dayRepository.findOne({
                    where: { id: dayId },
                    relations: ["concerts"],
                });
                if (!day) {
                    yield queryRunner.rollbackTransaction();
                    return res.status(404).json({ message: "Jour non trouvé" });
                }
                // Détacher les concerts associés
                day.concerts = [];
                yield dayRepository.save(day);
                // Maintenant, supprimer le Day
                const deleteResult = yield dayRepository.delete(dayId);
                if (deleteResult.affected === 1) {
                    yield queryRunner.commitTransaction();
                    return res.status(200).json({ message: "Jour supprimé avec succès" });
                }
                else {
                    yield queryRunner.rollbackTransaction();
                    return res.status(404).json({ message: "Jour non trouvé" });
                }
            }
            catch (error) {
                yield queryRunner.rollbackTransaction();
                console.error("Erreur lors de la suppression du jour:", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
            finally {
                yield queryRunner.release();
            }
        });
    }
    /**
     * Ajouter des concerts à un Day
     * PUT /api/days/:id/concerts
     */
    static addConcerts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dayId = parseInt(req.params.id, 10);
            const { concertIds } = req.body; // expecting array of concert IDs
            if (isNaN(dayId)) {
                return res.status(400).json({ message: "ID de jour invalide" });
            }
            if (!Array.isArray(concertIds) || concertIds.some(id => isNaN(parseInt(id, 10)))) {
                return res.status(400).json({ message: "Liste d'IDs de concerts invalide" });
            }
            try {
                const dayRepository = data_source_1.AppDataSource.getRepository(Day_1.Day);
                const concertRepository = data_source_1.AppDataSource.getRepository(Concert_1.Concert);
                const day = yield dayRepository.findOne({
                    where: { id: dayId },
                    relations: ['concerts'],
                });
                if (!day) {
                    return res.status(404).json({ message: "Jour non trouvé" });
                }
                const concerts = yield concertRepository.findByIds(concertIds);
                if (concerts.length !== concertIds.length) {
                    return res.status(404).json({ message: "Un ou plusieurs concerts non trouvés" });
                }
                day.concerts = [...day.concerts, ...concerts];
                yield dayRepository.save(day);
                return res.status(200).json(day);
            }
            catch (error) {
                console.error("Erreur lors de l'ajout de concerts au jour:", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
}
exports.default = DayController;
