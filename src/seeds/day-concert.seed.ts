import { DataSource } from "typeorm";
import { Concert } from "../entity/Concert";
import { Day } from "../entity/Day";

export const seedDaysAndConcerts = async (dataSource: DataSource) => {
  const concertRepo = dataSource.getRepository(Concert);
  const dayRepo = dataSource.getRepository(Day);

  // 1. Concerts
  const concertsData = [
    {
      title: "Les Dromaludaires",
      description: "description du concert 1",
      performer: "Artiste 1",
      time: "12:00",
      location: "Paris",
      image: "",
    },
    {
      title: "Groupe de jazz All in Jazz",
      description: "description du concert 2",
      performer: "Artiste 2",
      time: "14:00",
      location: "Classic",
      image: "",
    },
    {
      title: "Jazz Vance",
      description: "description du concert 3",
      performer: "Artiste 3",
      time: "15:00",
      location: "VIP",
      image: "",
    },
    {
      title: "Villette",
      description: "description du concert 4",
      performer: "Artiste 4",
      time: "16:00",
      location: "Lyon",
      image: "",
    },
    {
      title: "The Count Basie",
      description: "description du concert 5",
      performer: "Artiste 5",
      time: "17:00",
      location: "Marseille",
      image: "",
    },
    {
      title: "The Modern Jazz Quartet",
      description: "description du concert 6",
      performer: "Artiste 6",
      time: "18:00",
      location: "Bordeaux",
      image: "",
    },
    {
      title: "Blue Note All Stars",
      description: "description du concert 7",
      performer: "Artiste 7",
      time: "19:00",
      location: "Nice",
      image: "",
    },
    {
      title: "Paris Jazz Big Band",
      description: "description du concert 8",
      performer: "Artiste 8",
      time: "20:00",
      location: "Paris",
      image: "",
    },
    {
      title: "Jazz Messengers",
      description: "description du concert 9",
      performer: "Artiste 9",
      time: "21:00",
      location: "Toulouse",
      image: "",
    },
  ];
  const concerts: Concert[] = [];
  for (const data of concertsData) {
    let concert = await concertRepo.findOne({ where: { title: data.title } });
    if (!concert) {
      concert = concertRepo.create(data);
      await concertRepo.save(concert);
    }
    concerts.push(concert);
  }

  // 2. Days
  const daysData = [
    { title: "Jour 1", date: new Date("2024-09-09"), concertIdx: [0, 1, 2] },
    { title: "Jour 2", date: new Date("2024-09-10"), concertIdx: [3, 4, 5] },
    { title: "Jour 3", date: new Date("2024-09-11"), concertIdx: [6, 7, 8] },
  ];
  for (const data of daysData) {
    let day = await dayRepo.findOne({
      where: { title: data.title },
      relations: ["concerts"],
    });
    if (!day) {
      day = dayRepo.create({
        title: data.title,
        date: data.date,
        concerts: data.concertIdx.map((idx) => concerts[idx]),
      });
      await dayRepo.save(day);
    } else {
      // Met à jour les concerts si besoin
      day.concerts = data.concertIdx.map((idx) => concerts[idx]);
      await dayRepo.save(day);
    }
  }

  console.log("✅ Days et Concerts insérés/associés (sans doublons).");
};
