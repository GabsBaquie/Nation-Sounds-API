import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export class CreateUserDto {
  @IsString()
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}
