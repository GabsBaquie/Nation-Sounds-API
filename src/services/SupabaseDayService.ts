import { supabase, SupabaseService } from "../config/supabase";

export class SupabaseDayService {
  /**
   * Récupère tous les jours depuis Supabase
   */
  static async getAllDays() {
    try {
      const days = await SupabaseService.getAllFromTable("day", "date ASC");
      return days;
    } catch (error) {
      console.error("Erreur lors de la récupération des jours:", error);
      throw error;
    }
  }

  /**
   * Récupère un jour par ID depuis Supabase
   */
  static async getDayById(id: number) {
    try {
      const { data, error } = await supabase
        .from("day")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du jour ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les jours par plage de dates
   */
  static async getDaysByDateRange(startDate: string, endDate: string) {
    try {
      const { data, error } = await supabase
        .from("day")
        .select("*")
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des jours par plage:",
        error
      );
      throw error;
    }
  }

  /**
   * Crée un nouveau jour dans Supabase
   */
  static async createDay(dayData: {
    title: string;
    date: string;
    description?: string;
  }) {
    try {
      const newDay = await SupabaseService.insertRecord("day", {
        ...dayData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return newDay[0];
    } catch (error) {
      console.error("Erreur lors de la création du jour:", error);
      throw error;
    }
  }

  /**
   * Met à jour un jour dans Supabase
   */
  static async updateDay(id: number, updates: any) {
    try {
      const updatedDay = await SupabaseService.updateRecord("day", id, {
        ...updates,
        updated_at: new Date().toISOString(),
      });
      return updatedDay[0];
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du jour ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime un jour de Supabase
   */
  static async deleteDay(id: number) {
    try {
      const deletedDay = await SupabaseService.deleteRecord("day", id);
      return deletedDay[0];
    } catch (error) {
      console.error(`Erreur lors de la suppression du jour ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les jours avec leurs concerts associés
   */
  static async getDaysWithConcerts() {
    try {
      const { data, error } = await supabase
        .from("day")
        .select(
          `
          *,
          concert_days_day (
            concertId,
            concert:concert (
              id,
              title,
              description,
              performer,
              time,
              location,
              image,
              created_at,
              updated_at
            )
          )
        `
        )
        .order("date", { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des jours avec concerts:",
        error
      );
      throw error;
    }
  }

  /**
   * Ajoute des concerts à un jour
   */
  static async addConcertsToDay(dayId: number, concertIds: number[]) {
    try {
      // Supprimer les associations existantes
      await supabase.from("concert_days_day").delete().eq("dayId", dayId);

      // Ajouter les nouvelles associations
      const associations = concertIds.map((concertId) => ({
        dayId,
        concertId,
      }));

      const { data, error } = await supabase
        .from("concert_days_day")
        .insert(associations)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(
        `Erreur lors de l'ajout des concerts au jour ${dayId}:`,
        error
      );
      throw error;
    }
  }
}
