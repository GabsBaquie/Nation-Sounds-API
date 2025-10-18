import { query } from "../database/connection";
import { CreateSecurityInfoDto, SecurityInfo } from "../types/database";

export class SecurityInfoService {
  // Récupérer toutes les informations de sécurité
  static async findAll(): Promise<SecurityInfo[]> {
    const result = await query(
      'SELECT * FROM security_info ORDER BY "createdAt" DESC'
    );
    return result.rows;
  }

  // Récupérer une information de sécurité par ID
  static async findById(id: number): Promise<SecurityInfo | null> {
    const result = await query("SELECT * FROM security_info WHERE id = $1", [
      id,
    ]);
    return result.rows[0] || null;
  }

  // Créer une nouvelle information de sécurité
  static async create(
    securityData: CreateSecurityInfoDto
  ): Promise<SecurityInfo> {
    const result = await query(
      `
      INSERT INTO security_info (title, description, urgence, actif)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
      [
        securityData.title,
        securityData.description,
        securityData.urgence,
        securityData.actif,
      ]
    );

    return result.rows[0];
  }

  // Mettre à jour une information de sécurité
  static async update(
    id: number,
    securityData: CreateSecurityInfoDto
  ): Promise<SecurityInfo | null> {
    const result = await query(
      `
      UPDATE security_info 
      SET title = $1, description = $2, urgence = $3, actif = $4
      WHERE id = $5
      RETURNING *
    `,
      [
        securityData.title,
        securityData.description,
        securityData.urgence,
        securityData.actif,
        id,
      ]
    );

    return result.rows[0] || null;
  }

  // Supprimer une information de sécurité
  static async delete(id: number): Promise<boolean> {
    const result = await query("DELETE FROM security_info WHERE id = $1", [id]);
    return result.rowCount > 0;
  }

  // Récupérer les informations de sécurité actives
  static async findActive(): Promise<SecurityInfo[]> {
    const result = await query(
      'SELECT * FROM security_info WHERE actif = true ORDER BY "createdAt" DESC'
    );
    return result.rows;
  }

  // Récupérer les informations de sécurité urgentes
  static async findUrgent(): Promise<SecurityInfo[]> {
    const result = await query(
      'SELECT * FROM security_info WHERE urgence = true AND actif = true ORDER BY "createdAt" DESC'
    );
    return result.rows;
  }

  // Récupérer les informations de sécurité par urgence
  static async findByUrgency(urgence: boolean): Promise<SecurityInfo[]> {
    const result = await query(
      'SELECT * FROM security_info WHERE urgence = $1 ORDER BY "createdAt" DESC',
      [urgence]
    );
    return result.rows;
  }

  // Récupérer les informations de sécurité par statut actif
  static async findByActiveStatus(actif: boolean): Promise<SecurityInfo[]> {
    const result = await query(
      'SELECT * FROM security_info WHERE actif = $1 ORDER BY "createdAt" DESC',
      [actif]
    );
    return result.rows;
  }

  // Rechercher des informations de sécurité par titre ou description
  static async search(searchTerm: string): Promise<SecurityInfo[]> {
    const result = await query(
      'SELECT * FROM security_info WHERE title ILIKE $1 OR description ILIKE $1 ORDER BY "createdAt" DESC',
      [`%${searchTerm}%`]
    );
    return result.rows;
  }

  // Activer/Désactiver une information de sécurité
  static async toggleActive(id: number): Promise<SecurityInfo | null> {
    const result = await query(
      `
      UPDATE security_info 
      SET actif = NOT actif
      WHERE id = $1
      RETURNING *
    `,
      [id]
    );

    return result.rows[0] || null;
  }

  // Marquer une information comme urgente/non urgente
  static async toggleUrgency(id: number): Promise<SecurityInfo | null> {
    const result = await query(
      `
      UPDATE security_info 
      SET urgence = NOT urgence
      WHERE id = $1
      RETURNING *
    `,
      [id]
    );

    return result.rows[0] || null;
  }

  // Récupérer les statistiques des informations de sécurité
  static async getStats(): Promise<{
    total: number;
    active: number;
    urgent: number;
    inactive: number;
  }> {
    const result = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE actif = true) as active,
        COUNT(*) FILTER (WHERE urgence = true AND actif = true) as urgent,
        COUNT(*) FILTER (WHERE actif = false) as inactive
      FROM security_info
    `);

    const stats = result.rows[0];
    return {
      total: parseInt(stats.total),
      active: parseInt(stats.active),
      urgent: parseInt(stats.urgent),
      inactive: parseInt(stats.inactive),
    };
  }
}
