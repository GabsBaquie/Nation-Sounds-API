-- Migration pour ajouter la table partenaires
-- Date: 2024-01-XX
-- Description: Ajoute la table partenaires pour gérer les partenaires du festival

-- Table des partenaires
CREATE TABLE IF NOT EXISTS "partenaire" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR NOT NULL,
    "type" VARCHAR NOT NULL,
    "link" VARCHAR,
    "logo_url" VARCHAR,
    "logo_alt" VARCHAR,
    "actif" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS "IDX_partenaire_actif" ON "partenaire" ("actif");
CREATE INDEX IF NOT EXISTS "IDX_partenaire_type" ON "partenaire" ("type");
CREATE INDEX IF NOT EXISTS "IDX_partenaire_created_at" ON "partenaire" ("created_at");

-- Appliquer le trigger pour mettre à jour automatiquement updated_at
DROP TRIGGER IF EXISTS update_partenaire_updated_at ON "partenaire";
CREATE TRIGGER update_partenaire_updated_at 
    BEFORE UPDATE ON "partenaire" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insérer des données d'exemple
INSERT INTO "partenaire" (name, type, link, logo_url, logo_alt, actif) VALUES
('Radio France', 'Media', 'https://www.radiofrance.fr/', '/images/partenaires/radiofrance.webp', 'Logo Radio France', true),
('Ville de Paris', 'Institution', 'https://www.paris.fr/', '/images/partenaires/paris.webp', 'Logo Ville de Paris', true),
('Spotify', 'Tech', 'https://www.spotify.com/', '/images/partenaires/spotify.webp', 'Logo Spotify', true),
('France Inter', 'Media', 'https://www.franceinter.fr/', '/images/partenaires/france-inter.webp', 'Logo France Inter', true),
('Région Île-de-France', 'Institution', 'https://www.iledefrance.fr/', '/images/partenaires/ile-de-france.webp', 'Logo Région Île-de-France', true),
('Deezer', 'Tech', 'https://www.deezer.com/', '/images/partenaires/deezer.webp', 'Logo Deezer', true);
