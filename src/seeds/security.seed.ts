import { DataSource } from "typeorm";
import { SecurityInfo } from "../entity/SecurityInfo";

export const seedSecurityInfos = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(SecurityInfo);
  const infos = [
    {
      title: "Alerte Météo : Orage Imminent",
      description:
        "Un orage est prévu dans la zone du festival dans les prochaines heures. Veuillez vous diriger vers les abris prévus pour votre sécurité",
      urgence: true,
      actif: true,
    },
    {
      title: "Problème de Sécurité : Évacuation en cours",
      description:
        "En raison d’un incident, une évacuation est en cours dans la zone du concert principal. Veuillez suivre les instructions du personnel de sécurité",
      urgence: true,
      actif: true,
    },
    {
      title: "Changement de dernière minute : Nouveau groupe à 19h",
      description:
        "Le groupe X ne pourra pas se produire ce soir à 19h. Le groupe Y jouera à sa place. Consultez le programme pour plus d’informations",
      urgence: false,
      actif: true,
    },
  ];

  for (const info of infos) {
    const exists = await repo.findOne({ where: { title: info.title } });
    if (!exists) {
      await repo.save(info);
    }
  }

  console.log("✅ Infos de sécurité insérées (sans doublons).");
};
