import { IsBoolean, IsString } from "class-validator";

export class CreateSecurityInfoDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsBoolean()
  urgence!: boolean;

  @IsBoolean()
  actif!: boolean;
}
