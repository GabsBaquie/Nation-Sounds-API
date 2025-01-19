"use strict";
// src/controllers/ContentController.ts
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
const Content_1 = require("../entity/Content");
class ContentController {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contentRepository = data_source_1.AppDataSource.getRepository(Content_1.Content);
                const contents = yield contentRepository.find();
                return res.status(200).json(contents);
            }
            catch (error) {
                console.error("Erreur lors de la récupération des contenus:", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
    static getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentId = parseInt(req.params.id);
            try {
                const contentRepository = data_source_1.AppDataSource.getRepository(Content_1.Content);
                const content = yield contentRepository.findOne({
                    where: { id: contentId },
                });
                if (!content) {
                    return res.status(404).json({ message: "Contenu non trouvé" });
                }
                return res.status(200).json(content);
            }
            catch (error) {
                console.error("Erreur lors de la récupération du contenu:", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const contentRepository = data_source_1.AppDataSource.getRepository(Content_1.Content);
                const content = contentRepository.create(req.body);
                yield contentRepository.save(content);
                return res.status(201).json(content);
            }
            catch (error) {
                console.error("Erreur lors de la création du contenu:", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentId = parseInt(req.params.id);
            try {
                const contentRepository = data_source_1.AppDataSource.getRepository(Content_1.Content);
                let content = yield contentRepository.findOne({
                    where: { id: contentId },
                });
                if (!content) {
                    return res.status(404).json({ message: "Contenu non trouvé" });
                }
                contentRepository.merge(content, req.body);
                const results = yield contentRepository.save(content);
                return res.status(200).json(results);
            }
            catch (error) {
                console.error("Erreur lors de la mise à jour du contenu:", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const contentId = parseInt(req.params.id);
            try {
                const contentRepository = data_source_1.AppDataSource.getRepository(Content_1.Content);
                const result = yield contentRepository.delete(contentId);
                if (result.affected === 1) {
                    return res
                        .status(200)
                        .json({ message: "Contenu supprimé avec succès" });
                }
                else {
                    return res.status(404).json({ message: "Contenu non trouvé" });
                }
            }
            catch (error) {
                console.error("Erreur lors de la suppression du contenu:", error);
                return res.status(500).json({ message: "Erreur serveur" });
            }
        });
    }
}
exports.default = ContentController;
