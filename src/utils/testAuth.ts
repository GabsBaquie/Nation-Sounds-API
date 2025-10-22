import * as jwt from "jsonwebtoken";

export interface TestUser {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
}

export function generateTestToken(user: TestUser): string {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || "test-secret", {
    expiresIn: "1h",
  });
}

export function getTestAdminToken(): string {
  return generateTestToken({
    id: 1,
    username: "admin",
    email: "admin@test.com",
    role: "admin",
  });
}

export function getTestUserToken(): string {
  return generateTestToken({
    id: 2,
    username: "user",
    email: "user@test.com",
    role: "user",
  });
}
