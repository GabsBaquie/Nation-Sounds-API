// DTOs pour les concerts
export class CreateConcertDto {
  title!: string;
  description!: string;
  performer!: string;
  time!: string;
  location!: string;
  image?: string;
  dayIds?: number[];
}

export class UpdateConcertDto {
  title?: string;
  description?: string;
  performer?: string;
  time?: string;
  location?: string;
  image?: string;
  dayIds?: number[];
  id?: number;
}
