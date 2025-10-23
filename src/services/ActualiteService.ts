import { query } from "../../database/scripts/connection";
import {
  CreateActualiteDto,
  UpdateActualiteDto,
} from "../dto/requests/actualite.dto";
import { Actualite } from "../types/database";

export class ActualiteService {
  // Récupérer toutes les actualités actives
  static async findAll(): Promise<Actualite[]> {
    try {
      const result = await query(
        `SELECT * FROM actualite WHERE actif = true ORDER BY 
         CASE importance 
           WHEN 'Très important' THEN 1 
           WHEN 'Important' THEN 2 
           WHEN 'Modéré' THEN 3 
           WHEN 'Peu important' THEN 4 
         END, created_at DESC`
      );
      return result.rows;
    } catch (error) {
      console.error("Erreur lors de la récupération des actualités:", error);
      throw error;
    }
  }

  // Récupérer toutes les actualités (y compris inactives)
  static async findAllAdmin(): Promise<Actualite[]> {
    try {
      const result = await query(
        `SELECT * FROM actualite ORDER BY 
         CASE importance 
           WHEN 'Très important' THEN 1 
           WHEN 'Important' THEN 2 
           WHEN 'Modéré' THEN 3 
           WHEN 'Peu important' THEN 4 
         END, created_at DESC`
      );
      return result.rows;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des actualités admin:",
        error
      );
      throw error;
    }
  }

  // Récupérer une actualité par ID
  static async findById(id: number): Promise<Actualite | null> {
    try {
      const result = await query(`SELECT * FROM actualite WHERE id = $1`, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'actualité:", error);
      throw error;
    }
  }

  // Créer une nouvelle actualité
  static async create(dto: CreateActualiteDto): Promise<Actualite> {
    try {
      const result = await query(
        `INSERT INTO actualite (title, description, text, image, importance, actif) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [
          dto.title,
          dto.description,
          dto.text || null,
          dto.image || null,
          dto.importance || "Modéré",
          dto.actif !== undefined ? dto.actif : true,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Erreur lors de la création de l'actualité:", error);
      throw error;
    }
  }

  // Mettre à jour une actualité
  static async update(
    id: number,
    dto: UpdateActualiteDto
  ): Promise<Actualite | null> {
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (dto.title !== undefined) {
        fields.push(`title = $${paramCount++}`);
        values.push(dto.title);
      }
      if (dto.description !== undefined) {
        fields.push(`description = $${paramCount++}`);
        values.push(dto.description);
      }
      if (dto.text !== undefined) {
        fields.push(`text = $${paramCount++}`);
        values.push(dto.text);
      }
      if (dto.image !== undefined) {
        fields.push(`image = $${paramCount++}`);
        values.push(dto.image);
      }
      if (dto.importance !== undefined) {
        fields.push(`importance = $${paramCount++}`);
        values.push(dto.importance);
      }
      if (dto.actif !== undefined) {
        fields.push(`actif = $${paramCount++}`);
        values.push(dto.actif);
      }

      if (fields.length === 0) {
        throw new Error("Aucun champ à mettre à jour");
      }

      values.push(id);
      const result = await query(
        `UPDATE actualite SET ${fields.join(
          ", "
        )} WHERE id = $${paramCount} RETURNING *`,
        values
      );

      return result.rows[0] || null;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'actualité:", error);
      throw error;
    }
  }

  // Supprimer une actualité
  static async delete(id: number): Promise<boolean> {
    try {
      const result = await query(`DELETE FROM actualite WHERE id = $1`, [id]);
      return result.rowCount > 0;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'actualité:", error);
      throw error;
    }
  }

  // Activer/Désactiver une actualité
  static async toggleActive(id: number): Promise<Actualite | null> {
    try {
      const result = await query(
        `UPDATE actualite SET actif = NOT actif WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error(
        "Erreur lors du changement de statut de l'actualité:",
        error
      );
      throw error;
    }
  }
}
