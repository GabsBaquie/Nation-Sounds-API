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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.closePool =
  exports.testConnection =
  exports.transaction =
  exports.getClient =
  exports.query =
  exports.pool =
    void 0;
const dotenv = __importStar(require("dotenv"));
const pg_1 = require("pg");
// Ne pas recharger dotenv si on est dans Docker (variables déjà injectées)
if (!process.env.IS_DOCKER) {
  if (process.env.NODE_ENV === "production") {
    dotenv.config({ path: ".env.docker" });
    console.log("Chargement de .env.docker");
  } else {
    dotenv.config();
    console.log("Chargement de .env");
  }
} else {
  console.log(
    "🔒 Docker détecté - utilisation des variables d'environnement injectées"
  );
}
const isDocker = process.env.IS_DOCKER === "true";
// Détection intelligente de l'URL de base de données
const postgresUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
console.log(
  "PostgreSQL URL utilisée :",
  postgresUrl === null || postgresUrl === void 0
    ? void 0
    : postgresUrl.replace(/:[^:]*@/, ":****@")
);
console.log("NODE_ENV:", process.env.NODE_ENV);
// Configuration du pool de connexions
const poolConfig = {
  connectionString: postgresUrl,
  ssl: false, // À activer si tu te connectes à une BDD distante sécurisée
  max: 20, // Nombre maximum de connexions dans le pool
  idleTimeoutMillis: 30000, // Fermer les connexions inactives après 30s
  connectionTimeoutMillis: 2000, // Timeout de connexion
};
exports.pool = new pg_1.Pool(poolConfig);
// Fonction pour exécuter une requête
const query = (text, params) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const start = Date.now();
    try {
      const res = yield exports.pool.query(text, params);
      const duration = Date.now() - start;
      if (process.env.NODE_ENV === "development") {
        console.log("Query executed", { text, duration, rows: res.rowCount });
      }
      return res;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  });
exports.query = query;
// Fonction pour obtenir une transaction
const getClient = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    return yield exports.pool.connect();
  });
exports.getClient = getClient;
// Fonction pour exécuter une transaction
const transaction = (callback) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const client = yield (0, exports.getClient)();
    try {
      yield client.query("BEGIN");
      const result = yield callback(client);
      yield client.query("COMMIT");
      return result;
    } catch (error) {
      yield client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });
exports.transaction = transaction;
// Test de connexion
const testConnection = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const result = yield (0, exports.query)("SELECT NOW()");
      console.log(
        "✅ Connexion à la base de données réussie !",
        result.rows[0]
      );
      return true;
    } catch (error) {
      console.error("❌ Erreur de connexion à la base de données:", error);
      return false;
    }
  });
exports.testConnection = testConnection;
// Fermer le pool de connexions
const closePool = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield exports.pool.end();
  });
exports.closePool = closePool;
