import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePoiDto {
  @IsString()
  title!: string;

  @IsString()
  type!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
