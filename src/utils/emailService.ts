import nodemailer from "nodemailer";
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

export const sendResetEmail = async (email: string, resetLink: string) => {
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

    const transporter = nodemailer.createTransport(transportConfig);

    try {
      await transporter.verify();
      console.log('✓ Service email configuré avec succès');
    } catch (verifyError) {
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

    const info = await transporter.sendMail(mailOptions);
    console.log('✓ Email de réinitialisation envoyé');
    return info;
  } catch (err) {
    const error = err as nodemailer.SentMessageInfo & {
      name?: string;
      code?: string;
      command?: string;
      response?: string;
    };

    console.error('✗ Erreur d\'envoi:', error.message || 'Erreur inconnue');
    throw new Error('Erreur lors de l\'envoi de l\'email de réinitialisation');
  }
};
