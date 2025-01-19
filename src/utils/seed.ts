// src/utils/seed.ts
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import bcrypt from "bcrypt";


// Fonction pour créer un utilisateur par défaut si aucun utilisateur n'existe dans la base de données
// Cette fonction est appelée lors de l'exécution de la commande npm run seed
// ! Cette fonction ne doit être utilisée qu'en développement

const createDefaultUser = async () => {
  const userRepository = AppDataSource.getRepository(User);

  const existingUser = await userRepository.findOne({ where: { email: "test@example.com" } });
  if (existingUser) {
    console.log("Utilisateur par défaut déjà existant.");
    return;
  }

  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = userRepository.create({
    username: "testuser",
    email: "test@example.com",
    password: hashedPassword,
    role: "admin", // ou "user" selon vos besoins
  });

  await userRepository.save(user);
  console.log("Utilisateur par défaut créé avec succès.");
};

AppDataSource.initialize()
  .then(async () => {
    await createDefaultUser();
    process.exit(0);
  })
  .catch((error) => {
    console.error("Erreur lors de la création de l'utilisateur par défaut :", error);
    process.exit(1);
  });