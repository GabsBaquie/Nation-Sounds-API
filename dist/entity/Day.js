"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Day = void 0;
// src/entity/Day.ts
const typeorm_1 = require("typeorm");
const Concert_1 = require("./Concert");
const Program_1 = require("./Program");
let Day = class Day {
};
exports.Day = Day;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Day.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Day.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Day.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Concert_1.Concert, (concert) => concert.days, {
        cascade: false, // Désactive le cascade pour éviter les suppressions circulaires
        eager: true, // Charge automatiquement les concerts associés lors de la récupération de Day
    }),
    __metadata("design:type", Array)
], Day.prototype, "concerts", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Program_1.Program, (program) => program.day, {
        nullable: true, // Rendre la relation optionnelle
        onDelete: "SET NULL", // Mettre dayId à NULL lors de la suppression d'un Day
        eager: true, // Charger automatiquement le Program associé
    }),
    __metadata("design:type", Program_1.Program)
], Day.prototype, "program", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Day.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Day.prototype, "updatedAt", void 0);
exports.Day = Day = __decorate([
    (0, typeorm_1.Entity)()
], Day);
