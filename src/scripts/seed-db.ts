import * as bcrypt from "bcrypt";
import { query } from "../database/connection";
import { ConcertService } from "../services/ConcertService";
import { DayService } from "../services/DayService";
import { PoiService } from "../services/PoiService";
import { SecurityInfoService } from "../services/SecurityInfoService";
import { UserService } from "../services/UserService";

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log("🌱 Seeding de la base de données...");

    // Nettoyer les tables existantes (dans l'ordre pour respecter les contraintes FK)
    await query('DELETE FROM "concert_days_day"');
    await query('DELETE FROM "day"');
    await query('DELETE FROM "concert"');
    await query('DELETE FROM "poi"');
    await query('DELETE FROM "security_info"');
    await query("DELETE FROM \"user\" WHERE email != 'admin@example.com'");

    console.log("🧹 Tables nettoyées");

    // 1. Créer des utilisateurs de test
    const hashedPassword = await bcrypt.hash("password123", 10);
    await UserService.create({
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Utilisateurs créés");

    // 2. Créer des concerts
    const concerts = [
      {
        title: "Les Dromaludaires",
        description: "Concert de jazz moderne avec des influences africaines",
        performer: "Groupe Les Dromaludaires",
        time: "12:00",
        location: "Scène principale",
        image: null,
      },
      {
        title: "Groupe de jazz All in Jazz",
        description: "Performance de jazz classique et contemporain",
        performer: "All in Jazz Band",
        time: "14:00",
        location: "Scène jazz",
        image: null,
      },
      {
        title: "Jazz Vance",
        description: "Concert de jazz fusion avec des éléments électroniques",
        performer: "Jazz Vance",
        time: "15:00",
        location: "Scène VIP",
        image: null,
      },
      {
        title: "Villette",
        description: "Performance acoustique dans l'esprit du jazz parisien",
        performer: "Villette Quartet",
        time: "16:00",
        location: "Scène découverte",
        image: null,
      },
      {
        title: "The Count Basie",
        description: "Hommage au grand Count Basie",
        performer: "Count Basie Tribute Band",
        time: "17:00",
        location: "Scène principale",
        image: null,
      },
      {
        title: "The Modern Jazz Quartet",
        description: "Jazz moderne et expérimental",
        performer: "Modern Jazz Quartet",
        time: "18:00",
        location: "Scène jazz",
        image: null,
      },
      {
        title: "Blue Note All Stars",
        description: "Les meilleurs artistes du label Blue Note",
        performer: "Blue Note All Stars",
        time: "19:00",
        location: "Scène principale",
        image: null,
      },
      {
        title: "Paris Jazz Big Band",
        description: "Big band de jazz parisien",
        performer: "Paris Jazz Big Band",
        time: "20:00",
        location: "Scène principale",
        image: null,
      },
      {
        title: "Jazz Messengers",
        description: "Concert de jazz bebop et hard bop",
        performer: "Jazz Messengers",
        time: "21:00",
        location: "Scène jazz",
        image: null,
      },
    ];

    const createdConcerts = [];
    for (const concertData of concerts) {
      const concert = await ConcertService.create(concertData);
      if (!concert) {
        throw new Error("Erreur lors de la création d'un concert");
      }
      createdConcerts.push(concert);
    }

    console.log("✅ Concerts créés");

    // 3. Créer des jours avec leurs concerts
    const days = [
      {
        title: "Jour 1",
        date: "2024-09-09",
        concertIds: [
          createdConcerts[0].id,
          createdConcerts[1].id,
          createdConcerts[2].id,
        ],
      },
      {
        title: "Jour 2",
        date: "2024-09-10",
        concertIds: [
          createdConcerts[3].id,
          createdConcerts[4].id,
          createdConcerts[5].id,
        ],
      },
      {
        title: "Jour 3",
        date: "2024-09-11",
        concertIds: [
          createdConcerts[6].id,
          createdConcerts[7].id,
          createdConcerts[8].id,
        ],
      },
    ];

    for (const dayData of days) {
      await DayService.create(dayData);
    }

    console.log("✅ Jours créés avec leurs concerts");

    // 4. Créer des POIs
    const pois = [
      {
        title: "Grande Scène",
        type: "stage",
        latitude: 48.8708,
        longitude: 2.3785,
        description: "La scène principale du festival",
        category: "concert",
        address: "Parc de la Villette, Paris",
      },
      {
        title: "Scène Jazz Club",
        type: "stage",
        latitude: 48.8712,
        longitude: 2.3791,
        description: "Ambiance club pour les groupes de jazz",
        category: "concert",
        address: "Allée du Jazz, Paris",
      },
      {
        title: "Bar Central",
        type: "bar",
        latitude: 48.8705,
        longitude: 2.3779,
        description: "Bar principal avec boissons et snacks",
        category: "food",
        address: "Place du Village, Paris",
      },
      {
        title: "Toilettes Nord",
        type: "restroom",
        latitude: 48.871,
        longitude: 2.378,
        description: "Toilettes accessibles près de la grande scène",
        category: "service",
        address: "Avenue des Services, Paris",
      },
      {
        title: "Boutique Officielle",
        type: "shop",
        latitude: 48.8702,
        longitude: 2.3787,
        description: "Vente de souvenirs et merchandising",
        category: "shop",
        address: "Rue des Souvenirs, Paris",
      },
      {
        title: "Point Info",
        type: "info",
        latitude: 48.8709,
        longitude: 2.3793,
        description: "Point d'information pour les festivaliers",
        category: "service",
        address: "Place de l'Accueil, Paris",
      },
    ];

    for (const poiData of pois) {
      await PoiService.create(poiData);
    }

    console.log("✅ POIs créés");

    // 5. Créer des informations de sécurité
    const securityInfos = [
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
          "En raison d'un incident, une évacuation est en cours dans la zone du concert principal. Veuillez suivre les instructions du personnel de sécurité",
        urgence: true,
        actif: true,
      },
      {
        title: "Changement de dernière minute : Nouveau groupe à 19h",
        description:
          "Le groupe X ne pourra pas se produire ce soir à 19h. Le groupe Y jouera à sa place. Consultez le programme pour plus d'informations",
        urgence: false,
        actif: true,
      },
    ];

    for (const securityData of securityInfos) {
      await SecurityInfoService.create(securityData);
    }

    console.log("✅ Informations de sécurité créées");

    console.log("🎉 Seeding terminé avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du seeding:", error);
    throw error;
  }
};

// Exécuter si le script est appelé directement
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("🎉 Seeding terminé !");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Échec du seeding:", error);
      process.exit(1);
    });
}
