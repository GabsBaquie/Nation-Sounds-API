import { createClient } from "@supabase/supabase-js";

// Configuration Supabase
const supabaseUrl =
  process.env.SUPABASE_URL || "https://dtvryosgiqnwcfceazcj.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
}

// Client Supabase avec Service Role (pour les opérations admin)
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Client Supabase pour l'authentification utilisateur (avec anon key)
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
export const supabaseAuth = supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Fonctions utilitaires pour Supabase
export class SupabaseService {
  /**
   * Exécute une requête SQL brute sur Supabase
   */
  static async executeQuery(query: string, params?: any[]) {
    try {
      const { data, error } = await supabase.rpc("execute_sql", {
        query,
        params: params || [],
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erreur Supabase query:", error);
      throw error;
    }
  }

  /**
   * Récupère tous les enregistrements d'une table
   */
  static async getAllFromTable(tableName: string, orderBy?: string) {
    try {
      let query = supabase.from(tableName).select("*");

      if (orderBy) {
        query = query.order(orderBy);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur Supabase getAllFromTable(${tableName}):`, error);
      throw error;
    }
  }

  /**
   * Insère un nouvel enregistrement
   */
  static async insertRecord(tableName: string, record: any) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert(record)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur Supabase insertRecord(${tableName}):`, error);
      throw error;
    }
  }

  /**
   * Met à jour un enregistrement
   */
  static async updateRecord(tableName: string, id: number, updates: any) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur Supabase updateRecord(${tableName}):`, error);
      throw error;
    }
  }

  /**
   * Supprime un enregistrement
   */
  static async deleteRecord(tableName: string, id: number) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .delete()
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur Supabase deleteRecord(${tableName}):`, error);
      throw error;
    }
  }

  /**
   * Recherche dans une table
   */
  static async searchInTable(
    tableName: string,
    searchTerm: string,
    columns: string[]
  ) {
    try {
      let query = supabase.from(tableName).select("*");

      // Construire la condition OR pour la recherche
      const orConditions = columns.map((col) => `${col}.ilike.%${searchTerm}%`);
      query = query.or(orConditions.join(","));

      const { data, error } = await query;

      if (error) throw error;
      return data;
    } catch (error) {
      console.error(`Erreur Supabase searchInTable(${tableName}):`, error);
      throw error;
    }
  }
}

export default supabase;
