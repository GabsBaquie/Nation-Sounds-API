import nodemailer from "nodemailer";

export const sendResetEmail = async (email: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Email du service Gmail (voir section env)
      pass: process.env.EMAIL_PASS, // Mot de passe d'application Gmail
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER, // Utiliser l'email défini dans l'env
    to: email,
    subject: "Réinitialisation du mot de passe",
    html: `<p>Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le lien suivant pour le réinitialiser :</p>
           <a href="${resetLink}">Réinitialiser le mot de passe</a>`,
  });
};
