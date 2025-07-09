import { IsArray, IsInt, IsOptional, IsString } from "class-validator";

export class CreateConcertDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  performer!: string;

  @IsString()
  time!: string;

  @IsString()
  location!: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  dayIds?: number[];
}
