export class UserResponseDto {
  id!: number;
  username!: string;
  email!: string;
  role!: "admin" | "user";
  created_at!: Date;
}

export class LoginResponseDto {
  token!: string;
  user!: UserResponseDto;
}
