// DTOs pour les jours
export class CreateDayDto {
  title!: string;
  date!: string;
  image?: string;
  concertIds?: number[];
}

export class UpdateDayDto {
  title?: string;
  date?: string;
  image?: string;
  concertIds?: number[];
  id?: number;
}
