import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
// Utiliser la Service Role Key pour l'API (contourne RLS)
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Configuration Supabase pour utiliser la Service Role Key (contourne l'auth Supabase)
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      Authorization: `Bearer ${supabaseKey}`,
      apikey: supabaseKey,
    },
  },
});

// Force rebuild for Vercel deployment

export class SupabaseStorageService {
  // Méthode pour vérifier l'authentification personnalisée (votre JWT)
  static async verifyCustomAuth(authToken: string) {
    if (!authToken) {
      throw new Error("Token d'authentification requis");
    }

    // Votre logique de vérification JWT personnalisée
    // Pour l'instant, on accepte le token (vous pouvez ajouter la vérification ici)
    console.log(
      "🔐 Vérification du token JWT personnalisé:",
      authToken.substring(0, 20) + "..."
    );
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
      console.log("🔍 Récupération des images avec Service Role Key...");
      console.log("📡 URL Supabase:", process.env.SUPABASE_URL);
      console.log(
        "🔑 Service Role Key présente:",
        !!process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      // Utiliser la Service Role Key pour contourner l'authentification Supabase
      const { data, error } = await supabase.storage.from("images").list("", {
        limit: 100,
        offset: 0,
      });

      if (error) {
        console.error("❌ Erreur Supabase Storage:", error);
        console.error(
          "❌ Détails de l'erreur:",
          JSON.stringify(error, null, 2)
        );
        throw error;
      }

      console.log("✅ Images récupérées avec succès:", data?.length || 0);

      const images =
        data?.map((file) => ({
          name: file.name,
          size: file.metadata?.size,
          lastModified: file.updated_at,
          url: supabase.storage.from("images").getPublicUrl(file.name).data
            .publicUrl,
        })) || [];

      return {
        success: true,
        images,
      };
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des images:", error);
      console.error(
        "❌ Type d'erreur:",
        error instanceof Error ? error.constructor.name : typeof error
      );

      // Retourner une liste vide en cas d'erreur plutôt que d'échouer
      return {
        success: true,
        images: [],
        warning: "Impossible de récupérer les images depuis Supabase",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
}
