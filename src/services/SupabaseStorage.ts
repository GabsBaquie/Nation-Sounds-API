import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Force rebuild for Vercel deployment

export class SupabaseStorageService {
  static async uploadImage(
    file: Buffer,
    filename: string,
    contentType: string
  ) {
    try {
      const { data, error } = await supabase.storage
        .from("images")
        .upload(filename, file, {
          contentType,
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filename);

      return {
        success: true,
        path: data.path,
        url: urlData.publicUrl,
      };
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  static async deleteImage(filename: string) {
    try {
      const { error } = await supabase.storage
        .from("images")
        .remove([filename]);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  static async listImages() {
    try {
      const { data, error } = await supabase.storage.from("images").list("", {
        limit: 100,
        offset: 0,
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        images: data.map((file) => ({
          name: file.name,
          size: file.metadata?.size,
          lastModified: file.updated_at,
          url: supabase.storage.from("images").getPublicUrl(file.name).data
            .publicUrl,
        })),
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des images:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
}
