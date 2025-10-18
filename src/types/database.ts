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

// Table de jointure pour la relation Many-to-Many entre Concert et Day
export interface ConcertDay {
  concertId: number;
  dayId: number;
}

// Types pour les requêtes avec relations
export interface ConcertWithDays extends Concert {
  days?: Day[];
}

export interface DayWithConcerts extends Day {
  concerts?: Concert[];
}

// Types pour les DTOs (Data Transfer Objects)
export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

export interface CreateConcertDto {
  title: string;
  description: string;
  performer: string;
  time: string;
  location: string;
  image?: string | null;
  dayIds?: number[];
}

export interface CreateDayDto {
  title: string;
  date: string;
  concertIds?: number[];
}

export interface CreatePoiDto {
  title: string;
  type: string;
  latitude: number;
  longitude: number;
  description?: string;
  category?: string;
  address?: string;
}

export interface CreateSecurityInfoDto {
  title: string;
  description: string;
  urgence: boolean;
  actif: boolean;
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Types pour les requêtes avec pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
