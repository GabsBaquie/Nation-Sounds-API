import { Pool } from "pg";
import {
  CreatePartenaireDto,
  UpdatePartenaireDto,
} from "../dto/requests/partenaire.dto";
import { Partenaire } from "../types/database";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:oSDtMiPZ3ij7RVnC@db.dtvryosgiqnwcfceazcj.supabase.co:5432/postgres",
});

export class PartenaireService {
  static async findAll(): Promise<Partenaire[]> {
    try {
      const result = await pool.query(
        "SELECT * FROM partenaire WHERE actif = true ORDER BY type, name"
      );
      return result.rows;
    } catch (error) {
      console.error("Erreur lors de la récupération des partenaires:", error);
      throw error;
    }
  }

  static async findAllAdmin(): Promise<Partenaire[]> {
    try {
      const result = await pool.query(
        "SELECT * FROM partenaire ORDER BY type, name"
      );
      return result.rows;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des partenaires (admin):",
        error
      );
      throw error;
    }
  }

  static async findById(id: number): Promise<Partenaire | null> {
    try {
      const result = await pool.query(
        "SELECT * FROM partenaire WHERE id = $1",
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("Erreur lors de la récupération du partenaire:", error);
      throw error;
    }
  }

  static async create(dto: CreatePartenaireDto): Promise<Partenaire> {
    try {
      const result = await pool.query(
        `INSERT INTO partenaire (name, type, link, image, logo_alt, actif) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [
          dto.name,
          dto.type,
          dto.link || null,
          dto.image || null,
          dto.logo_alt || null,
          dto.actif !== undefined ? dto.actif : true,
        ]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Erreur lors de la création du partenaire:", error);
      throw error;
    }
  }

  static async update(
    id: number,
    dto: UpdatePartenaireDto
  ): Promise<Partenaire | null> {
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (dto.name !== undefined) {
        fields.push(`name = $${paramCount}`);
        values.push(dto.name);
        paramCount++;
      }

      if (dto.type !== undefined) {
        fields.push(`type = $${paramCount}`);
        values.push(dto.type);
        paramCount++;
      }

      if (dto.link !== undefined) {
        fields.push(`link = $${paramCount}`);
        values.push(dto.link);
        paramCount++;
      }

      if (dto.image !== undefined) {
        fields.push(`image = $${paramCount}`);
        values.push(dto.image); // null sera traité comme NULL en base
        paramCount++;
      }

      if (dto.logo_alt !== undefined) {
        fields.push(`logo_alt = $${paramCount}`);
        values.push(dto.logo_alt);
        paramCount++;
      }

      if (dto.actif !== undefined) {
        fields.push(`actif = $${paramCount}`);
        values.push(dto.actif);
        paramCount++;
      }

      if (fields.length === 0) {
        throw new Error("Aucun champ à mettre à jour");
      }

      fields.push(`updated_at = NOW()`);
      values.push(id);

      const query = `UPDATE partenaire SET ${fields.join(
        ", "
      )} WHERE id = $${paramCount} RETURNING *`;
      const result = await pool.query(query, values);

      return result.rows[0] || null;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du partenaire:", error);
      throw error;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const result = await pool.query("DELETE FROM partenaire WHERE id = $1", [
        id,
      ]);
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error("Erreur lors de la suppression du partenaire:", error);
      throw error;
    }
  }

  static async toggleActive(id: number): Promise<Partenaire | null> {
    try {
      const result = await pool.query(
        `UPDATE partenaire SET actif = NOT actif, updated_at = NOW() 
         WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error(
        "Erreur lors du basculement du statut du partenaire:",
        error
      );
      throw error;
    }
  }
}
