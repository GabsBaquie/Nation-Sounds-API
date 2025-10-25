import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
// Utiliser la Service Role Key pour l'API (contourne RLS)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Force rebuild for Vercel deployment

export class SupabaseStorageService {
  // Méthode pour vérifier l'authentification personnalisée
  static async verifyCustomAuth(authToken: string) {
    // Ici vous pouvez ajouter votre logique d'authentification personnalisée
    // Pour l'instant, on accepte tous les tokens (à adapter selon votre système)
    if (!authToken) {
      throw new Error("Token d'authentification requis");
    }
    // TODO: Ajouter la vérification de votre JWT personnalisé
    return { authenticated: true };
  }

  static async uploadImage(
    file: Buffer,
    filename: string,
    contentType: string,
    authToken?: string
  ) {
    try {
      // Vérifier l'authentification personnalisée si un token est fourni
      if (authToken) {
        await this.verifyCustomAuth(authToken);
      }

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

  static async deleteImage(filename: string, authToken?: string) {
    try {
      // Vérifier l'authentification personnalisée si un token est fourni
      if (authToken) {
        await this.verifyCustomAuth(authToken);
      }

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
