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
const dotenv_1 = __importDefault(require("dotenv"));
// Charger les variables d'environnement
dotenv_1.default.config();
const sendResetEmail = (email, resetLink) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const emailUser = process.env.EMAIL_USER;
        if (!emailUser) {
            throw new Error('EMAIL_USER environment variable is not set');
        }
        const emailPass = process.env.EMAIL_PASS;
        if (!emailPass) {
            throw new Error('EMAIL_PASS environment variable is not set');
        }
        const transportConfig = {
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '465'),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: emailUser,
                pass: emailPass
            }
        };
        const transporter = nodemailer_1.default.createTransport(transportConfig);
        try {
            yield transporter.verify();
            console.log('✓ Service email configuré avec succès');
        }
        catch (verifyError) {
            console.error('✗ Erreur de configuration email:', verifyError);
            throw verifyError;
        }
        const mailOptions = {
            from: {
                name: process.env.EMAIL_FROM_NAME || 'Nation Sounds',
                address: emailUser
            },
            to: email,
            subject: "Réinitialisation du mot de passe - Nation Sounds",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Réinitialisation de votre mot de passe</h2>
          <p>Vous avez demandé une réinitialisation de mot de passe pour votre compte Nation Sounds.</p>
          <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
          <a href="${resetLink}" 
             style="background-color: #4CAF50; 
                    color: white; 
                    padding: 14px 20px; 
                    text-align: center; 
                    text-decoration: none; 
                    display: inline-block; 
                    border-radius: 4px; 
                    margin: 4px 2px;">
            Réinitialiser le mot de passe
          </a>
          <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.</p>
          <p>Le lien expirera dans 1 heure.</p>
          <p>Cordialement,<br>L'équipe Nation Sounds</p>
        </div>
      `,
            text: `
        Réinitialisation de votre mot de passe
        
        Vous avez demandé une réinitialisation de mot de passe pour votre compte Nation Sounds.
        
        Cliquez sur le lien suivant pour réinitialiser votre mot de passe :
        ${resetLink}
        
        Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
        Le lien expirera dans 1 heure.
        
        Cordialement,
        L'équipe Nation Sounds
      `
        };
        const info = yield transporter.sendMail(mailOptions);
        console.log('✓ Email de réinitialisation envoyé');
        return info;
    }
    catch (err) {
        const error = err;
        console.error('✗ Erreur d\'envoi:', error.message || 'Erreur inconnue');
        throw new Error('Erreur lors de l\'envoi de l\'email de réinitialisation');
    }
});
exports.sendResetEmail = sendResetEmail;
