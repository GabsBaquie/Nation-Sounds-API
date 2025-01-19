"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SecurityInfoController_1 = __importDefault(require("../controllers/SecurityInfoController"));
const router = (0, express_1.Router)();
router.get('/', SecurityInfoController_1.default.getAll);
router.get('/:id', SecurityInfoController_1.default.getById);
router.post('/', SecurityInfoController_1.default.create);
router.put('/:id', SecurityInfoController_1.default.update);
router.delete('/:id', SecurityInfoController_1.default.delete);
exports.default = router;
