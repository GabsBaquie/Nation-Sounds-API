import { Pool, PoolClient } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

export class DatabaseManager {
  private pool: Pool;
  private client?: PoolClient;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  async connect(): Promise<boolean> {
    try {
      this.client = await this.pool.connect();
      console.log("✅ Connexion à la base de données réussie");
      return true;
    } catch (error: any) {
      console.error("❌ Erreur de connexion:", error.message);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      this.client.release();
    }
    await this.pool.end();
    console.log("🔌 Connexion fermée");
  }

  async executeQuery(query: string, params: any[] = []): Promise<any> {
    try {
      const result = await this.client!.query(query, params);
      return result;
    } catch (error: any) {
      console.error("❌ Erreur de requête:", error.message);
      throw error;
    }
  }

  async getFullDatabaseView(): Promise<any[]> {
    const result = await this.executeQuery("SELECT * FROM full_db ORDER BY source");
    return result.rows;
  }

  async getPublicDataView(): Promise<any[]> {
    const result = await this.executeQuery("SELECT * FROM public_data ORDER BY source");
    return result.rows;
  }

  async getDatabaseStats(): Promise<any[]> {
    const result = await this.executeQuery("SELECT * FROM db_stats ORDER BY table_name");
    return result.rows;
  }

  async getPoiStatsByType(): Promise<any[]> {
    const result = await this.executeQuery("SELECT * FROM poi_stats_by_type ORDER BY count DESC");
    return result.rows;
  }

  async getConcertsByMonth(): Promise<any[]> {
    const result = await this.executeQuery("SELECT * FROM concerts_by_month ORDER BY month DESC");
    return result.rows;
  }

  async getSecurityInfoStats(): Promise<any[]> {
    const result = await this.executeQuery("SELECT * FROM security_info_stats ORDER BY count DESC");
    return result.rows;
  }

  async getRecentActivity(): Promise<any[]> {
    const result = await this.executeQuery("SELECT * FROM recent_activity ORDER BY created_at DESC LIMIT 10");
    return result.rows;
  }

  async getConcertsWithDays(): Promise<any[]> {
    const result = await this.executeQuery("SELECT * FROM concerts_with_days ORDER BY created_at DESC");
    return result.rows;
  }

  async getDaysWithConcerts(): Promise<any[]> {
    const result = await this.executeQuery("SELECT * FROM days_with_concerts ORDER BY created_at DESC");
    return result.rows;
  }
}

// Fonction utilitaire pour tester toutes les vues
export async function testAllViews(): Promise<void> {
  const db = new DatabaseManager();
  
  try {
    await db.connect();
    
    console.log("🧪 Test de toutes les vues...\n");
    
    // Test des vues principales
    const views = [
      { name: "full_db", method: "getFullDatabaseView" },
      { name: "public_data", method: "getPublicDataView" },
      { name: "db_stats", method: "getDatabaseStats" },
      { name: "poi_stats_by_type", method: "getPoiStatsByType" },
      { name: "concerts_by_month", method: "getConcertsByMonth" },
      { name: "security_info_stats", method: "getSecurityInfoStats" },
      { name: "recent_activity", method: "getRecentActivity" },
      { name: "concerts_with_days", method: "getConcertsWithDays" },
      { name: "days_with_concerts", method: "getDaysWithConcerts" }
    ];

    for (const view of views) {
      try {
        const data = await (db as any)[view.method]();
        console.log(`✅ ${view.name}: ${data.length} enregistrements`);
      } catch (error: any) {
        console.log(`❌ ${view.name}: ${error.message}`);
      }
    }
    
  } catch (error: any) {
    console.error("❌ Erreur lors du test:", error.message);
  } finally {
    await db.disconnect();
  }
}

// Exécution directe si le script est appelé directement
if (require.main === module) {
  testAllViews();
}
