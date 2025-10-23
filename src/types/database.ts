// Types pour la base de données - remplacement des entités TypeORM

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  resetToken?: string | null;
  resetTokenExpiration?: Date | null;
  role: "admin" | "user";
  created_at: Date;
}

export interface Day {
  id: number;
  title: string;
  date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Concert {
  id: number;
  title: string;
  description: string;
  performer: string;
  time: string;
  location: string;
  image?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface POI {
  id: number;
  title: string;
  type: string;
  latitude: number;
  longitude: number;
  description?: string | null;
  category?: string | null;
  address?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface SecurityInfo {
  id: number;
  title: string;
  description: string;
  urgence: boolean;
  actif: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Actualite {
  id: number;
  title: string;
  description: string;
  text?: string | null;
  image?: string | null;
  importance: "Très important" | "Important" | "Modéré" | "Peu important";
  actif: boolean;
  created_at: Date;
  updated_at: Date;
}

// Table de jointure pour la relation Many-to-Many entre Concert et Day
export interface ConcertDay {
  concertId: number;
  dayId: number;
}

// Interface pour les partenaires
export interface Partenaire {
  id: number;
  name: string;
  type: string;
  link?: string;
  logo_url?: string;
  logo_alt?: string;
  actif: boolean;
  created_at: Date;
  updated_at: Date;
}

// Types pour les requêtes avec relations
export interface ConcertWithDays extends Concert {
  days?: Day[];
}

export interface DayWithConcerts extends Day {
  concerts?: Concert[];
}

// Note: DTOs are now in src/dto/ directory
// This file contains only database entity interfaces

// Note: API response types are now in src/dto/common/api-response.dto.ts
