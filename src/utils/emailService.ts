import nodemailer from "nodemailer";

export const sendResetEmail = async (email: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Ou ton service email
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: "ton-email@gmail.com",
    to: email,
    subject: "Réinitialisation du mot de passe",
    html: `<p>Vous avez demandé une réinitialisation de mot de passe. Cliquez sur le lien suivant pour le réinitialiser :</p>
           <a href="${resetLink}">Réinitialiser le mot de passe</a>`,
  });
};
