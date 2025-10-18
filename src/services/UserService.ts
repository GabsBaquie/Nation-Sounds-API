import { query, transaction } from "../../database/scripts/connection";
import { CreateUserDto } from "../dto/requests/create-user.dto";
import { User } from "../types/database";

export class UserService {
  // Récupérer tous les utilisateurs
  static async findAll(): Promise<User[]> {
    const result = await query(
      'SELECT id, username, email, "resetToken", "resetTokenExpiration", role, created_at FROM "user" ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Récupérer un utilisateur par ID
  static async findById(id: number): Promise<User | null> {
    const result = await query(
      'SELECT id, username, email, "resetToken", "resetTokenExpiration", role, created_at FROM "user" WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  // Récupérer un utilisateur par email
  static async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM "user" WHERE email = $1', [
      email,
    ]);
    return result.rows[0] || null;
  }

  // Récupérer un utilisateur par username
  static async findByUsername(username: string): Promise<User | null> {
    const result = await query('SELECT * FROM "user" WHERE username = $1', [
      username,
    ]);
    return result.rows[0] || null;
  }

  // Créer un nouvel utilisateur
  static async create(
    userData: CreateUserDto & { password: string }
  ): Promise<User> {
    const result = await query(
      'INSERT INTO "user" (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role, created_at',
      [userData.username, userData.email, userData.password, userData.role]
    );
    return result.rows[0];
  }

  // Mettre à jour un utilisateur
  static async update(
    id: number,
    userData: Partial<CreateUserDto>
  ): Promise<User | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (userData.username !== undefined) {
      fields.push(`username = $${paramCount++}`);
      values.push(userData.username);
    }
    if (userData.email !== undefined) {
      fields.push(`email = $${paramCount++}`);
      values.push(userData.email);
    }
    if (userData.role !== undefined) {
      fields.push(`role = $${paramCount++}`);
      values.push(userData.role);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await query(
      `UPDATE "user" SET ${fields.join(", ")} WHERE id = $${
        paramCount + 1
      } RETURNING id, username, email, role, created_at`,
      values
    );
    return result.rows[0] || null;
  }

  // Supprimer un utilisateur
  static async delete(id: number): Promise<boolean> {
    const result = await query('DELETE FROM "user" WHERE id = $1', [id]);
    return result.rowCount > 0;
  }

  // Compter les utilisateurs par rôle
  static async countByRole(role: "admin" | "user"): Promise<number> {
    const result = await query(
      'SELECT COUNT(*) as count FROM "user" WHERE role = $1',
      [role]
    );
    return parseInt(result.rows[0].count);
  }

  // Mettre à jour le token de réinitialisation
  static async updateResetToken(
    email: string,
    token: string,
    expiration: Date
  ): Promise<boolean> {
    const result = await query(
      'UPDATE "user" SET "resetToken" = $1, "resetTokenExpiration" = $2 WHERE email = $3',
      [token, expiration, email]
    );
    return result.rowCount > 0;
  }

  // Réinitialiser le mot de passe
  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<boolean> {
    return await transaction(async (client) => {
      // Vérifier que le token existe et n'est pas expiré
      const userResult = await client.query(
        'SELECT id FROM "user" WHERE "resetToken" = $1 AND "resetTokenExpiration" > NOW()',
        [token]
      );

      if (userResult.rows.length === 0) {
        return false;
      }

      // Mettre à jour le mot de passe et supprimer le token
      const updateResult = await client.query(
        'UPDATE "user" SET password = $1, "resetToken" = NULL, "resetTokenExpiration" = NULL WHERE "resetToken" = $2',
        [newPassword, token]
      );

      return (updateResult.rowCount ?? 0) > 0;
    });
  }

  // Vérifier si un email existe
  static async emailExists(
    email: string,
    excludeId?: number
  ): Promise<boolean> {
    let queryText = 'SELECT id FROM "user" WHERE email = $1';
    const params = [email];

    if (excludeId) {
      queryText += " AND id != $2";
      params.push(excludeId.toString());
    }

    const result = await query(queryText, params);
    return result.rows.length > 0;
  }

  // Vérifier si un username existe
  static async usernameExists(
    username: string,
    excludeId?: number
  ): Promise<boolean> {
    let queryText = 'SELECT id FROM "user" WHERE username = $1';
    const params = [username];

    if (excludeId) {
      queryText += " AND id != $2";
      params.push(excludeId.toString());
    }

    const result = await query(queryText, params);
    return result.rows.length > 0;
  }
}
