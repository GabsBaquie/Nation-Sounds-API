import fs from "fs";
import path from "path";
import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:oSDtMiPZ3ij7RVnC@db.dtvryosgiqnwcfceazcj.supabase.co:5432/postgres",
});

export class ImageService {
  /**
   * Récupère toutes les images disponibles
   */
  static async getAllImages(): Promise<string[]> {
    try {
      const imagesDir = path.join(__dirname, "../../upload/image");

      // Vérifier que le dossier existe
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
        return [];
      }

      const files = fs.readdirSync(imagesDir);
      return files.map((file) => `/upload/image/${file}`);
    } catch (error) {
      console.error("Erreur lors de la récupération des images:", error);
      throw error;
    }
  }

  /**
   * Supprime une image et toutes ses références dans la base de données
   */
  static async deleteImage(
    filename: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const imagePath = path.join(__dirname, "../../upload/image", filename);
      const imageUrl = `/upload/image/${filename}`;

      // Vérifier que le fichier existe
      if (!fs.existsSync(imagePath)) {
        return { success: false, message: "Image non trouvée" };
      }

      // Supprimer les références dans toutes les tables
      await this.removeImageReferences(imageUrl);

      // Supprimer le fichier physique
      fs.unlinkSync(imagePath);

      return {
        success: true,
        message: `Image ${filename} supprimée avec succès`,
      };
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
      throw error;
    }
  }

  /**
   * Renomme une image
   */
  static async renameImage(
    filename: string,
    newName: string
  ): Promise<{ success: boolean; message: string; newPath?: string }> {
    try {
      const oldPath = path.join(__dirname, "../../upload/image", filename);
      const newPath = path.join(__dirname, "../../upload/image", newName);

      // Vérifier que le fichier existe
      if (!fs.existsSync(oldPath)) {
        return { success: false, message: "Image non trouvée" };
      }

      // Vérifier que le nouveau nom n'existe pas déjà
      if (fs.existsSync(newPath)) {
        return { success: false, message: "Une image avec ce nom existe déjà" };
      }

      // Renommer le fichier
      fs.renameSync(oldPath, newPath);

      const newImageUrl = `/upload/image/${newName}`;

      // Mettre à jour les références dans la base de données
      await this.updateImageReferences(
        `/upload/image/${filename}`,
        newImageUrl
      );

      return {
        success: true,
        message: `Image renommée: ${filename} -> ${newName}`,
        newPath: newImageUrl,
      };
    } catch (error) {
      console.error("Erreur lors du renommage de l'image:", error);
      throw error;
    }
  }

  /**
   * Supprime toutes les références à une image dans la base de données
   */
  private static async removeImageReferences(imageUrl: string): Promise<void> {
    try {
      // Tables qui peuvent contenir des références d'images
      const tables = [
        { table: "concert", column: "image" },
        { table: "actualite", column: "image" },
        { table: "partenaire", column: "image" },
        { table: "day", column: "image" },
      ];

      for (const { table, column } of tables) {
        const query = `UPDATE "${table}" SET "${column}" = NULL WHERE "${column}" = $1`;
        await pool.query(query, [imageUrl]);
      }

      console.log(`Références à l'image supprimées: ${imageUrl}`);
    } catch (error) {
      console.error("Erreur lors de la suppression des références:", error);
      throw error;
    }
  }

  /**
   * Met à jour les références d'images dans la base de données
   */
  private static async updateImageReferences(
    oldUrl: string,
    newUrl: string
  ): Promise<void> {
    try {
      const tables = [
        { table: "concert", column: "image" },
        { table: "actualite", column: "image" },
        { table: "partenaire", column: "image" },
        { table: "day", column: "image" },
      ];

      for (const { table, column } of tables) {
        const query = `UPDATE "${table}" SET "${column}" = $1 WHERE "${column}" = $2`;
        await pool.query(query, [newUrl, oldUrl]);
      }

      console.log(`Références mises à jour: ${oldUrl} -> ${newUrl}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des références:", error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques des images
   */
  static async getImageStats(): Promise<{
    totalImages: number;
    imagesByTable: Record<string, number>;
    unusedImages: string[];
  }> {
    try {
      const imagesDir = path.join(__dirname, "../../upload/image");
      const allFiles = fs.existsSync(imagesDir)
        ? fs.readdirSync(imagesDir)
        : [];
      const totalImages = allFiles.length;

      // Compter les images utilisées par table
      const imagesByTable: Record<string, number> = {};
      const tables = ["concert", "actualite", "partenaire", "day"];

      for (const table of tables) {
        const query = `SELECT COUNT(*) as count FROM "${table}" WHERE "image" IS NOT NULL AND "image" != ''`;
        const result = await pool.query(query);
        imagesByTable[table] = parseInt(result.rows[0].count);
      }

      // Trouver les images non utilisées
      const usedImages = new Set<string>();
      for (const table of tables) {
        const query = `SELECT "image" FROM "${table}" WHERE "image" IS NOT NULL AND "image" != ''`;
        const result = await pool.query(query);
        result.rows.forEach((row) => usedImages.add(row.image));
      }

      const allImagePaths = allFiles.map((file) => `/upload/image/${file}`);
      const unusedImages = allImagePaths.filter((img) => !usedImages.has(img));

      return {
        totalImages,
        imagesByTable,
        unusedImages,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      throw error;
    }
  }
}
