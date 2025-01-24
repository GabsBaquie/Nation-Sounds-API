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
const data_source_1 = require("../data-source");
const Day_1 = require("../entity/Day");
class ProgramController {
    // GET /api/programs
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const programRepository = data_source_1.AppDataSource.getRepository(Day_1.Day);
                const programs = yield programRepository.find({
                    relations: ['day', 'day.concerts'],
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
                    relations: ['day', 'day.concerts'],
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
}
exports.default = ProgramController;
