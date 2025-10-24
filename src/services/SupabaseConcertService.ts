import { SupabaseService, supabase } from "../config/supabase";

export class SupabaseConcertService {
  /**
   * Récupère tous les concerts depuis Supabase
   */
  static async getAllConcerts() {
    try {
      const concerts = await SupabaseService.getAllFromTable(
        "concert",
        "created_at DESC"
      );
      return concerts;
    } catch (error) {
      console.error("Erreur lors de la récupération des concerts:", error);
      throw error;
    }
  }

  /**
   * Récupère un concert par ID depuis Supabase
   */
  static async getConcertById(id: number) {
    try {
      const { data, error } = await supabase
        .from("concert")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du concert ${id}:`, error);
      throw error;
    }
  }

  /**
   * Recherche des concerts dans Supabase
   */
  static async searchConcerts(searchTerm: string) {
    try {
      const concerts = await SupabaseService.searchInTable(
        "concert",
        searchTerm,
        ["title", "description", "performer", "location"]
      );
      return concerts;
    } catch (error) {
      console.error("Erreur lors de la recherche de concerts:", error);
      throw error;
    }
  }

  /**
   * Crée un nouveau concert dans Supabase
   */
  static async createConcert(concertData: {
    title: string;
    description?: string;
    performer: string;
    time: string;
    location: string;
    image?: string;
  }) {
    try {
      const newConcert = await SupabaseService.insertRecord("concert", {
        ...concertData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return newConcert[0];
    } catch (error) {
      console.error("Erreur lors de la création du concert:", error);
      throw error;
    }
  }

  /**
   * Met à jour un concert dans Supabase
   */
  static async updateConcert(id: number, updates: any) {
    try {
      const updatedConcert = await SupabaseService.updateRecord("concert", id, {
        ...updates,
        updated_at: new Date().toISOString(),
      });
      return updatedConcert[0];
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du concert ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime un concert de Supabase
   */
  static async deleteConcert(id: number) {
    try {
      const deletedConcert = await SupabaseService.deleteRecord("concert", id);
      return deletedConcert[0];
    } catch (error) {
      console.error(`Erreur lors de la suppression du concert ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les concerts avec leurs jours associés
   */
  static async getConcertsWithDays() {
    try {
      const { data, error } = await supabase.from("concert").select(`
          *,
          concert_days_day (
            dayId,
            day:day (
              id,
              title,
              date,
              created_at,
              updated_at
            )
          )
        `);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des concerts avec jours:",
        error
      );
      throw error;
    }
  }
}
