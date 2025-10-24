// DTOs pour les informations de sécurité
export class CreateSecurityInfoDto {
  title!: string;
  description!: string;
  urgence?: boolean;
  actif?: boolean;
}

export class UpdateSecurityInfoDto {
  title?: string;
  description?: string;
  urgence?: boolean;
  actif?: boolean;
  id?: number;
}
