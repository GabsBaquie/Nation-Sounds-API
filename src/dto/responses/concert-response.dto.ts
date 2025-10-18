export class ConcertResponseDto {
  id!: number;
  title!: string;
  description!: string;
  performer!: string;
  time!: string;
  location!: string;
  image?: string | null;
  created_at!: Date;
  updated_at!: Date;
  days?: DayResponseDto[];
}

export class DayResponseDto {
  id!: number;
  title!: string;
  date!: Date;
  created_at!: Date;
  updated_at!: Date;
  concerts?: ConcertResponseDto[];
}
