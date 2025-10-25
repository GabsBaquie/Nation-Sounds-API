// DTOs pour les utilisateurs
export type UserRole = "admin" | "user";

export class CreateUserDto {
  username!: string;
  email!: string;
  password!: string;
  role?: UserRole;
}

export class LoginDto {
  email!: string;
  password!: string;
}

export class ChangePasswordDto {
  currentPassword!: string;
  newPassword!: string;
}

export class ResetPasswordDto {
  email!: string;
}
