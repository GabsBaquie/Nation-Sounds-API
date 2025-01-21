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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendResetEmail = (email, resetLink) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Email du service Gmail (voir section env)
            pass: process.env.EMAIL_PASS, // Mot de passe d'application Gmail
        },
    });
    yield transporter.sendMail({
        from: process.env.EMAIL_USER, // Utiliser l'email défini dans l'env
        to: email,
        subject: "Réinitialisation du mot de passe",
        html: `<p>Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le lien suivant pour le réinitialiser :</p>
           <a href="${resetLink}">Réinitialiser le mot de passe</a>`,
    });
});
exports.sendResetEmail = sendResetEmail;
