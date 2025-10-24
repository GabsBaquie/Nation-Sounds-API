import { query } from "../../database/scripts/connection";
import { CreatePoiDto } from "../dto/requests/poi.dto";
import { POI } from "../types/database";

export class PoiService {
  // Récupérer tous les POIs
  static async findAll(type?: string): Promise<POI[]> {
    let queryText = "SELECT * FROM poi";
    const params: any[] = [];

    if (type) {
      queryText += " WHERE type = $1";
      params.push(type);
    }

    queryText += " ORDER BY created_at DESC";

    const result = await query(queryText, params);
    return result.rows;
  }

  // Récupérer un POI par ID
  static async findById(id: number): Promise<POI | null> {
    const result = await query("SELECT * FROM poi WHERE id = $1", [id]);
    return result.rows[0] || null;
  }

  // Créer un nouveau POI
  static async create(poiData: CreatePoiDto): Promise<POI> {
    const result = await query(
      `
      INSERT INTO poi (title, type, latitude, longitude, description, category, address)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      [
        poiData.title,
        poiData.type,
        poiData.latitude,
        poiData.longitude,
        poiData.description || null,
        poiData.category || null,
        poiData.address || null,
      ]
    );

    return result.rows[0];
  }

  // Mettre à jour un POI
  static async update(id: number, poiData: CreatePoiDto): Promise<POI | null> {
    const result = await query(
      `
      UPDATE poi 
      SET title = $1, type = $2, latitude = $3, longitude = $4, 
          description = $5, category = $6, address = $7
      WHERE id = $8
      RETURNING *
    `,
      [
        poiData.title,
        poiData.type,
        poiData.latitude,
        poiData.longitude,
        poiData.description || null,
        poiData.category || null,
        poiData.address || null,
        id,
      ]
    );

    return result.rows[0] || null;
  }

  // Supprimer un POI
  static async delete(id: number): Promise<boolean> {
    const result = await query("DELETE FROM poi WHERE id = $1", [id]);
    return result.rowCount > 0;
  }

  // Récupérer les POIs par type
  static async findByType(type: string): Promise<POI[]> {
    const result = await query(
      "SELECT * FROM poi WHERE type = $1 ORDER BY created_at DESC",
      [type]
    );
    return result.rows;
  }

  // Récupérer les POIs par catégorie
  static async findByCategory(category: string): Promise<POI[]> {
    const result = await query(
      "SELECT * FROM poi WHERE category = $1 ORDER BY created_at DESC",
      [category]
    );
    return result.rows;
  }

  // Rechercher des POIs par titre
  static async search(searchTerm: string): Promise<POI[]> {
    const result = await query(
      "SELECT * FROM poi WHERE title ILIKE $1 ORDER BY created_at DESC",
      [`%${searchTerm}%`]
    );
    return result.rows;
  }

  // Récupérer les POIs dans une zone géographique
  static async findByLocation(
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number
  ): Promise<POI[]> {
    const result = await query(
      `
      SELECT * FROM poi 
      WHERE latitude BETWEEN $1 AND $2 
        AND longitude BETWEEN $3 AND $4
      ORDER BY created_at DESC
    `,
      [minLat, maxLat, minLng, maxLng]
    );

    return result.rows;
  }

  // Récupérer les types de POIs disponibles
  static async getTypes(): Promise<string[]> {
    const result = await query("SELECT DISTINCT type FROM poi ORDER BY type");
    return result.rows.map((row: any) => row.type);
  }

  // Récupérer les catégories de POIs disponibles
  static async getCategories(): Promise<string[]> {
    const result = await query(
      "SELECT DISTINCT category FROM poi WHERE category IS NOT NULL ORDER BY category"
    );
    return result.rows.map((row: any) => row.category);
  }
}
