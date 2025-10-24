"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManager = void 0;
exports.testAllViews = testAllViews;
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: ".env.test" });
class DatabaseManager {
  constructor() {
    this.pool = new pg_1.Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }
  connect() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        this.client = yield this.pool.connect();
        console.log("✅ Connexion à la base de données réussie");
        return true;
      } catch (error) {
        console.error("❌ Erreur de connexion:", error.message);
        return false;
      }
    });
  }
  disconnect() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.client) {
        this.client.release();
      }
      yield this.pool.end();
      console.log("🔌 Connexion fermée");
    });
  }
  executeQuery(query_1) {
    return __awaiter(this, arguments, void 0, function* (query, params = []) {
      try {
        const result = yield this.client.query(query, params);
        return result;
      } catch (error) {
        console.error("❌ Erreur de requête:", error.message);
        throw error;
      }
    });
  }
  getFullDatabaseView() {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield this.executeQuery(
        "SELECT * FROM full_db ORDER BY source"
      );
      return result.rows;
    });
  }
  getPublicDataView() {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield this.executeQuery(
        "SELECT * FROM public_data ORDER BY source"
      );
      return result.rows;
    });
  }
  getDatabaseStats() {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield this.executeQuery(
        "SELECT * FROM db_stats ORDER BY table_name"
      );
      return result.rows;
    });
  }
  getPoiStatsByType() {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield this.executeQuery(
        "SELECT * FROM poi_stats_by_type ORDER BY count DESC"
      );
      return result.rows;
    });
  }
  getConcertsByMonth() {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield this.executeQuery(
        "SELECT * FROM concerts_by_month ORDER BY month DESC"
      );
      return result.rows;
    });
  }
  getSecurityInfoStats() {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield this.executeQuery(
        "SELECT * FROM security_info_stats ORDER BY count DESC"
      );
      return result.rows;
    });
  }
  getRecentActivity() {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield this.executeQuery(
        "SELECT * FROM recent_activity ORDER BY created_at DESC LIMIT 10"
      );
      return result.rows;
    });
  }
  getConcertsWithDays() {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield this.executeQuery(
        "SELECT * FROM concerts_with_days ORDER BY created_at DESC"
      );
      return result.rows;
    });
  }
  getDaysWithConcerts() {
    return __awaiter(this, void 0, void 0, function* () {
      const result = yield this.executeQuery(
        "SELECT * FROM days_with_concerts ORDER BY created_at DESC"
      );
      return result.rows;
    });
  }
}
exports.DatabaseManager = DatabaseManager;
// Fonction utilitaire pour tester toutes les vues
function testAllViews() {
  return __awaiter(this, void 0, void 0, function* () {
    const db = new DatabaseManager();
    try {
      yield db.connect();
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
        { name: "days_with_concerts", method: "getDaysWithConcerts" },
      ];
      for (const view of views) {
        try {
          const data = yield db[view.method]();
          console.log(`✅ ${view.name}: ${data.length} enregistrements`);
        } catch (error) {
          console.log(`❌ ${view.name}: ${error.message}`);
        }
      }
    } catch (error) {
      console.error("❌ Erreur lors du test:", error.message);
    } finally {
      yield db.disconnect();
    }
  });
}
// Exécution directe si le script est appelé directement
if (require.main === module) {
  testAllViews();
}
