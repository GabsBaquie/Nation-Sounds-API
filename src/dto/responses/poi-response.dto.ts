export class PoiResponseDto {
  id!: number;
  title!: string;
  type!: string;
  latitude!: number;
  longitude!: number;
  description?: string | null;
  category?: string | null;
  address?: string | null;
  created_at!: Date;
  updated_at!: Date;
}
