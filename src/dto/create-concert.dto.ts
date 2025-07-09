import { IsString, IsOptional, IsArray, IsInt } from "class-validator";

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

  @IsString()
  image!: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  dayIds?: number[];
}
