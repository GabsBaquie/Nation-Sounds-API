import { query, transaction } from "../../database/scripts/connection";
import { CreateDayDto } from "../dto/requests/day.dto";
import { DayWithConcerts } from "../types/database";

export class DayService {
  // Récupérer tous les jours avec leurs concerts
  static async findAll(): Promise<DayWithConcerts[]> {
    const result = await query(`
      SELECT 
        d.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', c.id,
              'title', c.title,
              'description', c.description,
              'performer', c.performer,
              'time', c.time,
              'location', c.location,
              'image', c.image,
              'created_at', c.created_at,
              'updated_at', c.updated_at
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::json
        ) as concerts
      FROM day d
      LEFT JOIN concert_days_day cd ON d.id = cd."dayId"
      LEFT JOIN concert c ON cd."concertId" = c.id
      GROUP BY d.id
      ORDER BY d.date ASC
    `);

    return result.rows.map((row: any) => ({
      ...row,
      concerts: row.concerts || [],
    }));
  }

  // Récupérer un jour par ID avec ses concerts
  static async findById(id: number): Promise<DayWithConcerts | null> {
    const result = await query(
      `
      SELECT 
        d.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', c.id,
              'title', c.title,
              'description', c.description,
              'performer', c.performer,
              'time', c.time,
              'location', c.location,
              'image', c.image,
              'created_at', c.created_at,
              'updated_at', c.updated_at
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::json
        ) as concerts
      FROM day d
      LEFT JOIN concert_days_day cd ON d.id = cd."dayId"
      LEFT JOIN concert c ON cd."concertId" = c.id
      WHERE d.id = $1
      GROUP BY d.id
    `,
      [id]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      concerts: row.concerts || [],
    };
  }

  // Créer un nouveau jour
  static async create(dayData: CreateDayDto): Promise<DayWithConcerts | null> {
    return await transaction(async (client) => {
      // Insérer le jour
      const dayResult = await client.query(
        `
        INSERT INTO day (title, date)
        VALUES ($1, $2)
        RETURNING *
      `,
        [dayData.title, new Date(dayData.date)]
      );

      const day = dayResult.rows[0];

      // Associer les concerts si fournis
      if (dayData.concertIds && dayData.concertIds.length > 0) {
        // Vérifier que tous les concerts existent
        const concertCheckResult = await client.query(
          "SELECT id FROM concert WHERE id = ANY($1)",
          [dayData.concertIds]
        );

        if (concertCheckResult.rows.length !== dayData.concertIds.length) {
          throw new Error("Un ou plusieurs concerts n'ont pas été trouvés");
        }

        // Insérer les associations
        for (const concertId of dayData.concertIds) {
          await client.query(
            'INSERT INTO concert_days_day ("concertId", "dayId") VALUES ($1, $2)',
            [concertId, day.id]
          );
        }
      }

      // Retourner le jour avec ses concerts en utilisant la transaction
      const result = await client.query(
        `
        SELECT 
          d.*,
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', c.id,
                'title', c.title,
                'description', c.description,
                'performer', c.performer,
                'time', c.time,
                'location', c.location,
                'image', c.image,
                'created_at', c.created_at,
                'updated_at', c.updated_at
              )
            ) FILTER (WHERE c.id IS NOT NULL),
            '[]'::json
          ) as concerts
        FROM day d
        LEFT JOIN concert_days_day cd ON d.id = cd."dayId"
        LEFT JOIN concert c ON cd."concertId" = c.id
        WHERE d.id = $1
        GROUP BY d.id
      `,
        [day.id]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return {
        ...result.rows[0],
        concerts: result.rows[0].concerts || [],
      };
    });
  }

  // Mettre à jour un jour
  static async update(
    id: number,
    dayData: CreateDayDto
  ): Promise<DayWithConcerts | null> {
    return await transaction(async (client) => {
      // Vérifier que le jour existe
      const existingDay = await client.query(
        "SELECT id FROM day WHERE id = $1",
        [id]
      );
      if (existingDay.rows.length === 0) {
        return null;
      }

      // Mettre à jour le jour
      await client.query(
        `
        UPDATE day 
        SET title = $1, date = $2
        WHERE id = $3
      `,
        [dayData.title, new Date(dayData.date), id]
      );

      // Mettre à jour les associations avec les concerts
      if (dayData.concertIds !== undefined) {
        // Supprimer les anciennes associations
        await client.query('DELETE FROM concert_days_day WHERE "dayId" = $1', [
          id,
        ]);

        // Créer les nouvelles associations
        if (dayData.concertIds.length > 0) {
          // Vérifier que tous les concerts existent
          const concertCheckResult = await client.query(
            "SELECT id FROM concert WHERE id = ANY($1)",
            [dayData.concertIds]
          );

          if (concertCheckResult.rows.length !== dayData.concertIds.length) {
            throw new Error("Un ou plusieurs concerts n'ont pas été trouvés");
          }

          // Insérer les nouvelles associations
          for (const concertId of dayData.concertIds) {
            await client.query(
              'INSERT INTO concert_days_day ("concertId", "dayId") VALUES ($1, $2)',
              [concertId, id]
            );
          }
        }
      }

      // Retourner le jour mis à jour avec ses concerts en utilisant le client de la transaction
      const result = await client.query(
        `
        SELECT 
          d.*,
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', c.id,
                'title', c.title,
                'description', c.description,
                'performer', c.performer,
                'time', c.time,
                'location', c.location,
                'image', c.image,
                'created_at', c.created_at,
                'updated_at', c.updated_at
              )
            ) FILTER (WHERE c.id IS NOT NULL),
            '[]'::json
          ) as concerts
        FROM day d
        LEFT JOIN concert_days_day cd ON d.id = cd."dayId"
        LEFT JOIN concert c ON cd."concertId" = c.id
        WHERE d.id = $1
        GROUP BY d.id
      `,
        [id]
      );

      const updatedDay = result.rows[0]
        ? {
            ...result.rows[0],
            concerts: result.rows[0].concerts || [],
          }
        : null;

      return updatedDay;
    });
  }

  // Supprimer un jour
  static async delete(id: number): Promise<boolean> {
    return await transaction(async (client) => {
      // Supprimer les associations avec les concerts
      await client.query('DELETE FROM concert_days_day WHERE "dayId" = $1', [
        id,
      ]);

      // Supprimer le jour
      const result = await client.query("DELETE FROM day WHERE id = $1", [id]);

      return (result.rowCount ?? 0) > 0;
    });
  }

  // Ajouter des concerts à un jour
  static async addConcerts(
    dayId: number,
    concertIds: number[]
  ): Promise<DayWithConcerts | null> {
    return await transaction(async (client) => {
      // Vérifier que le jour existe
      const dayExists = await client.query("SELECT id FROM day WHERE id = $1", [
        dayId,
      ]);
      if (dayExists.rows.length === 0) {
        return null;
      }

      // Vérifier que tous les concerts existent
      const concertCheckResult = await client.query(
        "SELECT id FROM concert WHERE id = ANY($1)",
        [concertIds]
      );

      if (concertCheckResult.rows.length !== concertIds.length) {
        throw new Error("Un ou plusieurs concerts n'ont pas été trouvés");
      }

      // Insérer les nouvelles associations (en ignorant les doublons)
      for (const concertId of concertIds) {
        await client.query(
          `
          INSERT INTO concert_days_day ("concertId", "dayId") 
          VALUES ($1, $2) 
          ON CONFLICT DO NOTHING
        `,
          [concertId, dayId]
        );
      }

      // Retourner le jour mis à jour
      return await this.findById(dayId);
    });
  }

  // Récupérer les jours par date
  static async findByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<DayWithConcerts[]> {
    const result = await query(
      `
      SELECT 
        d.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', c.id,
              'title', c.title,
              'description', c.description,
              'performer', c.performer,
              'time', c.time,
              'location', c.location,
              'image', c.image,
              'created_at', c.created_at,
              'updated_at', c.updated_at
            )
          ) FILTER (WHERE c.id IS NOT NULL),
          '[]'::json
        ) as concerts
      FROM day d
      LEFT JOIN concert_days_day cd ON d.id = cd."dayId"
      LEFT JOIN concert c ON cd."concertId" = c.id
      WHERE d.date BETWEEN $1 AND $2
      GROUP BY d.id
      ORDER BY d.date ASC
    `,
      [startDate, endDate]
    );

    return result.rows.map((row: any) => ({
      ...row,
      concerts: row.concerts || [],
    }));
  }
}
