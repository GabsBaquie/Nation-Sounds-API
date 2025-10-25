// DTOs pour les points d'intérêt
export class CreatePoiDto {
  title!: string;
  type!: string;
  latitude!: number;
  longitude!: number;
  description?: string;
  category?: string;
  address?: string;
}

export class UpdatePoiDto {
  title?: string;
  type?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  category?: string;
  address?: string;
  id?: number;
}
