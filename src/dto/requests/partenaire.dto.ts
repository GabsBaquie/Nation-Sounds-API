// DTOs pour les partenaires
export class CreatePartenaireDto {
  name!: string;
  type!: string;
  link?: string;
  logo_url?: string;
  logo_alt?: string;
  actif?: boolean;
}

export class UpdatePartenaireDto {
  name?: string;
  type?: string;
  link?: string;
  logo_url?: string;
  logo_alt?: string;
  actif?: boolean;
  id?: number;
}
