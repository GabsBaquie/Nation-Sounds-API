import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateDayDto {
  @IsString()
  title!: string;

  @IsDateString()
  date!: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  concertIds?: number[];
}
