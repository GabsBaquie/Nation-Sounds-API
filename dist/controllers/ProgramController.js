"use strict";
// src/controllers/ProgramController.ts
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
class ProgramController {
    // GET /api/programs
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const programRepository = data_source_1.AppDataSource.getRepository(Day_1.Day);
                const programs = yield programRepository.find({
                    relations: ['concerts'],
                });
                return res.status(200).json(programs);
            }
            catch (error) {
                console.error('Erreur lors de la récupération des programmes:', error);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    }
    // GET /api/programs/:id
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const programId = parseInt(req.params.id);
            try {
                const programRepository = data_source_1.AppDataSource.getRepository(Day_1.Day);
                const program = yield programRepository.findOne({
                    where: { id: programId },
                    relations: ['concerts'],
                });
                if (!program) {
                    return res.status(404).json({ message: 'Programme non trouvé' });
                }
                return res.status(200).json(program);
            }
            catch (error) {
                console.error('Erreur lors de la récupération du programme:', error);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    }
    // POST /api/programs
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const programRepository = data_source_1.AppDataSource.getRepository(Day_1.Day);
                const { title, date, concerts } = req.body;
                const program = programRepository.create({
                    title,
                    date,
                    concerts: concerts || []
                });
                const errors = yield (0, class_validator_1.validate)(program);
                if (errors.length > 0) {
                    return res.status(400).json(errors);
                }
                yield programRepository.save(program);
                return res.status(201).json(program);
            }
            catch (error) {
                console.error('Erreur lors de la création du programme:', error);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    }
    // PUT /api/programs/:id
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const programId = parseInt(req.params.id);
            try {
                const programRepository = data_source_1.AppDataSource.getRepository(Day_1.Day);
                let program = yield programRepository.findOne({
                    where: { id: programId },
                    relations: ['concerts'],
                });
                if (!program) {
                    return res.status(404).json({ message: 'Programme non trouvé' });
                }
                const { title, date, concerts } = req.body;
                if (title !== undefined)
                    program.title = title;
                if (date !== undefined)
                    program.date = date;
                if (concerts !== undefined)
                    program.concerts = concerts;
                const errors = yield (0, class_validator_1.validate)(program);
                if (errors.length > 0) {
                    return res.status(400).json(errors);
                }
                const results = yield programRepository.save(program);
                return res.status(200).json(results);
            }
            catch (error) {
                console.error('Erreur lors de la mise à jour du programme:', error);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    }
    // DELETE /api/programs/:id
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const programId = parseInt(req.params.id);
            try {
                const programRepository = data_source_1.AppDataSource.getRepository(Day_1.Day);
                const program = yield programRepository.findOne({
                    where: { id: programId },
                    relations: ['concerts'],
                });
                if (!program) {
                    return res.status(404).json({ message: 'Programme non trouvé' });
                }
                // Détacher les concerts avant la suppression
                program.concerts = [];
                yield programRepository.save(program);
                const result = yield programRepository.delete(programId);
                if (result.affected === 1) {
                    return res.status(200).json({ message: 'Programme supprimé avec succès' });
                }
                else {
                    return res.status(404).json({ message: 'Programme non trouvé' });
                }
            }
            catch (error) {
                console.error('Erreur lors de la suppression du programme:', error);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    }
}
exports.default = ProgramController;
