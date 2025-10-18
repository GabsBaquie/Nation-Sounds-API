import { query, transaction } from "../database/connection";
import { Concert, ConcertWithDays, CreateConcertDto } from "../types/database";

export class ConcertService {
  // Récupérer tous les concerts avec leurs jours associés
  static async findAll(): Promise<ConcertWithDays[]> {
    const result = await query(`
      SELECT 
        c.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', d.id,
              'title', d.title,
              'date', d.date,
              'created_at', d.created_at,
              'updated_at', d.updated_at
            )
          ) FILTER (WHERE d.id IS NOT NULL),
          '[]'::json
        ) as days
      FROM concert c
      LEFT JOIN concert_days_day cd ON c.id = cd."concertId"
      LEFT JOIN day d ON cd."dayId" = d.id
      GROUP BY c.id, c.created_at
      ORDER BY c.created_at DESC
    `);

    return result.rows.map((row: any) => ({
      ...row,
      days: row.days || [],
    }));
  }

  // Récupérer un concert par ID avec ses jours
  static async findById(id: number): Promise<ConcertWithDays | null> {
    const result = await query(
      `
      SELECT 
        c.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', d.id,
              'title', d.title,
              'date', d.date,
              'created_at', d.created_at,
              'updated_at', d.updated_at
            )
          ) FILTER (WHERE d.id IS NOT NULL),
          '[]'::json
        ) as days
      FROM concert c
      LEFT JOIN concert_days_day cd ON c.id = cd."concertId"
      LEFT JOIN day d ON cd."dayId" = d.id
      WHERE c.id = $1
      GROUP BY c.id
    `,
      [id]
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];
    return {
      ...row,
      days: row.days || [],
    };
  }

  // Créer un nouveau concert
  static async create(
    concertData: CreateConcertDto
  ): Promise<ConcertWithDays | null> {
    return await transaction(async (client) => {
      // Insérer le concert
      const concertResult = await client.query(
        `
        INSERT INTO concert (title, description, performer, time, location, image)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `,
        [
          concertData.title,
          concertData.description,
          concertData.performer,
          concertData.time,
          concertData.location,
          concertData.image || null,
        ]
      );

      const concert = concertResult.rows[0];

      // Associer les jours si fournis
      if (concertData.dayIds && concertData.dayIds.length > 0) {
        // Vérifier que tous les jours existent
        const dayCheckResult = await client.query(
          "SELECT id FROM day WHERE id = ANY($1)",
          [concertData.dayIds]
        );

        if (dayCheckResult.rows.length !== concertData.dayIds.length) {
          throw new Error("Un ou plusieurs jours n'ont pas été trouvés");
        }

        // Insérer les associations
        for (const dayId of concertData.dayIds) {
          await client.query(
            'INSERT INTO concert_days_day ("concertId", "dayId") VALUES ($1, $2)',
            [concert.id, dayId]
          );
        }
      }

      // Retourner le concert avec ses jours
      const result = await client.query(
        `
        SELECT 
          c.*,
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', d.id,
                'title', d.title,
                'date', d.date,
                'created_at', d.created_at,
                'updated_at', d.updated_at
              )
            ) FILTER (WHERE d.id IS NOT NULL),
            '[]'::json
          ) as days
        FROM concert c
        LEFT JOIN concert_days_day cd ON c.id = cd."concertId"
        LEFT JOIN day d ON cd."dayId" = d.id
        WHERE c.id = $1
        GROUP BY c.id
      `,
        [concert.id]
      );

      return result.rows[0] || null;
    });
  }

  // Mettre à jour un concert
  static async update(
    id: number,
    concertData: CreateConcertDto
  ): Promise<ConcertWithDays | null> {
    return await transaction(async (client) => {
      // Vérifier que le concert existe
      const existingConcert = await client.query(
        "SELECT id FROM concert WHERE id = $1",
        [id]
      );
      if (existingConcert.rows.length === 0) {
        return null;
      }

      // Mettre à jour le concert
      await client.query(
        `
        UPDATE concert 
        SET title = $1, description = $2, performer = $3, time = $4, location = $5, image = $6
        WHERE id = $7
      `,
        [
          concertData.title,
          concertData.description,
          concertData.performer,
          concertData.time,
          concertData.location,
          concertData.image || null,
          id,
        ]
      );

      // Mettre à jour les associations avec les jours
      if (concertData.dayIds !== undefined) {
        // Supprimer les anciennes associations
        await client.query(
          'DELETE FROM concert_days_day WHERE "concertId" = $1',
          [id]
        );

        // Créer les nouvelles associations
        if (concertData.dayIds.length > 0) {
          // Vérifier que tous les jours existent
          const dayCheckResult = await client.query(
            "SELECT id FROM day WHERE id = ANY($1)",
            [concertData.dayIds]
          );

          if (dayCheckResult.rows.length !== concertData.dayIds.length) {
            throw new Error("Un ou plusieurs jours n'ont pas été trouvés");
          }

          // Insérer les nouvelles associations
          for (const dayId of concertData.dayIds) {
            await client.query(
              'INSERT INTO concert_days_day ("concertId", "dayId") VALUES ($1, $2)',
              [id, dayId]
            );
          }
        }
      }

      // Retourner le concert mis à jour avec ses jours
      return await this.findById(id);
    });
  }

  // Supprimer un concert
  static async delete(id: number): Promise<boolean> {
    return await transaction(async (client) => {
      // Supprimer les associations avec les jours
      await client.query(
        'DELETE FROM concert_days_day WHERE "concertId" = $1',
        [id]
      );

      // Supprimer le concert
      const result = await client.query("DELETE FROM concert WHERE id = $1", [
        id,
      ]);

      return (result.rowCount ?? 0) > 0;
    });
  }

  // Récupérer les concerts par jour
  static async findByDayId(dayId: number): Promise<Concert[]> {
    const result = await query(
      `
      SELECT c.*
      FROM concert c
      INNER JOIN concert_days_day cd ON c.id = cd."concertId"
      WHERE cd."dayId" = $1
      ORDER BY c.time
    `,
      [dayId]
    );

    return result.rows;
  }

  // Rechercher des concerts par titre ou performer
  static async search(searchTerm: string): Promise<ConcertWithDays[]> {
    const result = await query(
      `
      SELECT 
        c.*,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', d.id,
              'title', d.title,
              'date', d.date,
              'created_at', d.created_at,
              'updated_at', d.updated_at
            )
          ) FILTER (WHERE d.id IS NOT NULL),
          '[]'::json
        ) as days
      FROM concert c
      LEFT JOIN concert_days_day cd ON c.id = cd."concertId"
      LEFT JOIN day d ON cd."dayId" = d.id
      WHERE c.title ILIKE $1 OR c.performer ILIKE $1
      GROUP BY c.id, c.created_at
      ORDER BY c.created_at DESC
    `,
      [`%${searchTerm}%`]
    );

    return result.rows.map((row: any) => ({
      ...row,
      days: row.days || [],
    }));
  }
}
