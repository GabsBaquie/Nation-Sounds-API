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
                const { title, date, concerts } = req.body;
                const day = dayRepository.create({ title, date, concerts });
                const errors = yield (0, class_validator_1.validate)(day);
                if (errors.length > 0) {
                    return res.status(400).json(errors);
                }
                yield dayRepository.save(day);
                return res.status(201).json(day);
            }
            catch (error) {
                console.error('Erreur lors de la création du jour:', error);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    }
    // PUT /api/days/:id
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dayId = parseInt(req.params.id);
            try {
                const dayRepository = data_source_1.AppDataSource.getRepository(Day_1.Day);
                let day = yield dayRepository.findOne({
                    where: { id: dayId },
                    relations: ['concerts'],
                });
                if (!day) {
                    return res.status(404).json({ message: 'Jour non trouvé' });
                }
                dayRepository.merge(day, req.body);
                const errors = yield (0, class_validator_1.validate)(day);
                if (errors.length > 0) {
                    return res.status(400).json(errors);
                }
                const results = yield dayRepository.save(day);
                return res.status(200).json(results);
            }
            catch (error) {
                console.error('Erreur lors de la mise à jour du jour:', error);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    }
    // DELETE /api/days/:id
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const dayId = parseInt(req.params.id);
            try {
                const dayRepository = data_source_1.AppDataSource.getRepository(Day_1.Day);
                const result = yield dayRepository.delete(dayId);
                if (result.affected === 1) {
                    return res.status(200).json({ message: 'Jour supprimé avec succès' });
                }
                else {
                    return res.status(404).json({ message: 'Jour non trouvé' });
                }
            }
            catch (error) {
                console.error('Erreur lors de la suppression du jour:', error);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    }
}
exports.default = DayController;
