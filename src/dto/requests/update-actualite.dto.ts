export class UpdateActualiteDto {
  title?: string;
  description?: string;
  text?: string;
  image?: string;
  importance?: "Très important" | "Important" | "Modéré" | "Peu important";
  actif?: boolean;
  id?: number;
}
