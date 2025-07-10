import bcrypt from "bcrypt";
import { DataSource } from "typeorm";
import { User } from "../entity/User";

export const seedUsers = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const existingUser = await userRepository.findOne({
    where: { email: "test@example.com" },
  });

  if (existingUser) {
    console.log("✅ Utilisateur déjà existant.");
    return;
  }

  const hashedPassword = await bcrypt.hash("password123", 10);

  const user = userRepository.create({
    username: "testuser",
    email: "test@example.com",
    password: hashedPassword,
    role: "admin",
  });

  await userRepository.save(user);
  console.log("✅ Utilisateur par défaut créé.");
};
