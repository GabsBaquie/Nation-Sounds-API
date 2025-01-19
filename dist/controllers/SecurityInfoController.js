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
const class_validator_1 = require("class-validator");
const data_source_1 = require("../data-source");
const SecurityInfo_1 = require("../entity/SecurityInfo");
class SecurityInfoController {
    // GET /api/securityInfos
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const securityInfoRepository = data_source_1.AppDataSource.getRepository(SecurityInfo_1.SecurityInfo);
                const infos = yield securityInfoRepository.find({
                    order: { createdAt: 'DESC' },
                });
                return res.status(200).json(infos);
            }
            catch (error) {
                console.error('Erreur lors de la récupération des informations de sécurité:', error);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    }
    // GET /api/securityInfos/:id
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const securityInfoId = parseInt(req.params.id);
            try {
                const securityInfoRepository = data_source_1.AppDataSource.getRepository(SecurityInfo_1.SecurityInfo);
                const info = yield securityInfoRepository.findOne({
                    where: { id: securityInfoId },
                });
                if (!info) {
                    return res
                        .status(404)
                        .json({ message: 'Information de sécurité non trouvée' });
                }
                return res.status(200).json(info);
            }
            catch (error) {
                console.error('Erreur lors de la récupération de l’information de sécurité:', error);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    }
    // POST /api/securityInfos
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const securityInfoRepository = data_source_1.AppDataSource.getRepository(SecurityInfo_1.SecurityInfo);
                const { title, description, urgence, actif } = req.body;
                const info = securityInfoRepository.create({
                    title,
                    description,
                    urgence,
                    actif,
                });
                const errors = yield (0, class_validator_1.validate)(info);
                if (errors.length > 0) {
                    return res.status(400).json(errors);
                }
                yield securityInfoRepository.save(info);
                return res.status(201).json(info);
            }
            catch (error) {
                console.error('Erreur lors de la création de l’information de sécurité:', error);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    }
    // PUT /api/securityInfos/:id
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const securityInfoId = parseInt(req.params.id);
            try {
                const securityInfoRepository = data_source_1.AppDataSource.getRepository(SecurityInfo_1.SecurityInfo);
                let info = yield securityInfoRepository.findOne({
                    where: { id: securityInfoId },
                });
                if (!info) {
                    return res
                        .status(404)
                        .json({ message: 'Information de sécurité non trouvée' });
                }
                const { title, description, urgence, actif } = req.body;
                securityInfoRepository.merge(info, {
                    title,
                    description,
                    urgence,
                    actif,
                });
                const errors = yield (0, class_validator_1.validate)(info);
                if (errors.length > 0) {
                    return res.status(400).json(errors);
                }
                const results = yield securityInfoRepository.save(info);
                return res.status(200).json(results);
            }
            catch (error) {
                console.error('Erreur lors de la mise à jour de l’information de sécurité:', error);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    }
    // DELETE /api/securityInfos/:id
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const securityInfoId = parseInt(req.params.id);
            try {
                const securityInfoRepository = data_source_1.AppDataSource.getRepository(SecurityInfo_1.SecurityInfo);
                const result = yield securityInfoRepository.delete(securityInfoId);
                if (result.affected === 1) {
                    return res
                        .status(200)
                        .json({ message: 'Information de sécurité supprimée avec succès' });
                }
                else {
                    return res
                        .status(404)
                        .json({ message: 'Information de sécurité non trouvée' });
                }
            }
            catch (error) {
                console.error('Erreur lors de la suppression de l’information de sécurité:', error);
                return res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    }
}
exports.default = SecurityInfoController;
