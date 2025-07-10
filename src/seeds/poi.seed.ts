import { DataSource } from "typeorm";
import { POI } from "../entity/POI";

export const seedPois = async (dataSource: DataSource) => {
  const poiRepo = dataSource.getRepository(POI);
  const pois = [
    {
      title: "Grande Scène",
      type: "stage",
      latitude: 48.8708,
      longitude: 2.3785,
      description: "La scène principale du festival.",
      category: "concert",
      address: "Parc de la Villette, Paris",
    },
    {
      title: "Scène Jazz Club",
      type: "stage",
      latitude: 48.8712,
      longitude: 2.3791,
      description: "Ambiance club pour les groupes de jazz.",
      category: "concert",
      address: "Allée du Jazz, Paris",
    },
    {
      title: "Bar Central",
      type: "bar",
      latitude: 48.8705,
      longitude: 2.3779,
      description: "Bar principal avec boissons et snacks.",
      category: "food",
      address: "Place du Village, Paris",
    },
    {
      title: "Toilettes Nord",
      type: "restroom",
      latitude: 48.871,
      longitude: 2.378,
      description: "Toilettes accessibles près de la grande scène.",
      category: "service",
      address: "Avenue des Services, Paris",
    },
    {
      title: "Boutique Officielle",
      type: "shop",
      latitude: 48.8702,
      longitude: 2.3787,
      description: "Vente de souvenirs et merchandising.",
      category: "shop",
      address: "Rue des Souvenirs, Paris",
    },
    {
      title: "Point Info",
      type: "info",
      latitude: 48.8709,
      longitude: 2.3793,
      description: "Point d'information pour les festivaliers.",
      category: "service",
      address: "Place de l'Accueil, Paris",
    },
    {
      title: "Scène Découverte",
      type: "stage",
      latitude: 48.8715,
      longitude: 2.3782,
      description: "Scène pour les jeunes talents.",
      category: "concert",
      address: "Allée des Découvertes, Paris",
    },
    {
      title: "Bar Lounge",
      type: "bar",
      latitude: 48.8706,
      longitude: 2.3795,
      description: "Bar avec espace détente.",
      category: "food",
      address: "Zone Chill, Paris",
    },
    {
      title: "Toilettes Sud",
      type: "restroom",
      latitude: 48.8703,
      longitude: 2.3788,
      description: "Toilettes proches de la scène découverte.",
      category: "service",
      address: "Avenue du Sud, Paris",
    },
  ];
  for (const poi of pois) {
    const exists = await poiRepo.findOne({ where: { title: poi.title } });
    if (!exists) {
      await poiRepo.save(poi);
    }
  }
  console.log("✅ POIs insérés (sans doublons).");
};
