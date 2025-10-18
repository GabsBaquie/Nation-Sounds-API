-- Script d'initialisation de la base de données Nation Sounds
-- Remplace les migrations TypeORM

-- Créer les tables principales

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR NOT NULL,
    "resetToken" VARCHAR(255),
    "resetTokenExpiration" TIMESTAMP,
    "role" VARCHAR(20) NOT NULL DEFAULT 'user' CHECK ("role" IN ('admin', 'user')),
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT "UQ_user_email_username" UNIQUE ("email", "username")
);

-- Table des jours
CREATE TABLE IF NOT EXISTS "day" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR NOT NULL,
    "date" TIMESTAMP NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table des concerts
CREATE TABLE IF NOT EXISTS "concert" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR NOT NULL,
    "description" TEXT NOT NULL,
    "performer" VARCHAR NOT NULL,
    "time" VARCHAR NOT NULL,
    "location" VARCHAR NOT NULL,
    "image" VARCHAR,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table des points d'intérêt
CREATE TABLE IF NOT EXISTS "poi" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "description" VARCHAR,
    "category" VARCHAR,
    "address" VARCHAR,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table des informations de sécurité
CREATE TABLE IF NOT EXISTS "security_info" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "urgence" BOOLEAN NOT NULL DEFAULT FALSE,
    "actif" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table de jointure pour la relation Many-to-Many entre Concert et Day
CREATE TABLE IF NOT EXISTS "concert_days_day" (
    "concertId" INTEGER NOT NULL,
    "dayId" INTEGER NOT NULL,
    PRIMARY KEY ("concertId", "dayId"),
    FOREIGN KEY ("concertId") REFERENCES "concert"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("dayId") REFERENCES "day"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);

-- Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS "IDX_concert_days_day_concertId" ON "concert_days_day" ("concertId");
CREATE INDEX IF NOT EXISTS "IDX_concert_days_day_dayId" ON "concert_days_day" ("dayId");
CREATE INDEX IF NOT EXISTS "IDX_user_email" ON "user" ("email");
CREATE INDEX IF NOT EXISTS "IDX_user_username" ON "user" ("username");
CREATE INDEX IF NOT EXISTS "IDX_day_date" ON "day" ("date");
CREATE INDEX IF NOT EXISTS "IDX_concert_time" ON "concert" ("time");
CREATE INDEX IF NOT EXISTS "IDX_poi_type" ON "poi" ("type");
CREATE INDEX IF NOT EXISTS "IDX_poi_category" ON "poi" ("category");
CREATE INDEX IF NOT EXISTS "IDX_security_info_actif" ON "security_info" ("actif");
CREATE INDEX IF NOT EXISTS "IDX_security_info_urgence" ON "security_info" ("urgence");

-- Créer les triggers pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer les triggers aux tables qui ont une colonne updated_at
DROP TRIGGER IF EXISTS update_day_updated_at ON "day";
CREATE TRIGGER update_day_updated_at BEFORE UPDATE ON "day" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_concert_updated_at ON "concert";
CREATE TRIGGER update_concert_updated_at BEFORE UPDATE ON "concert" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_poi_updated_at ON "poi";
CREATE TRIGGER update_poi_updated_at BEFORE UPDATE ON "poi" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_security_info_updated_at ON "security_info";
CREATE TRIGGER update_security_info_updated_at BEFORE UPDATE ON "security_info" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insérer un utilisateur admin par défaut (mot de passe: admin123)
INSERT INTO "user" (username, email, password, role) 
VALUES ('admin', 'admin@example.com', '$2b$10$rQZ8kL9vJ8K9vJ8K9vJ8K9vJ8K9vJ8K9vJ8K9vJ8K9vJ8K9vJ8K9vJ8K', 'admin')
ON CONFLICT (email, username) DO NOTHING;

COMMIT;
