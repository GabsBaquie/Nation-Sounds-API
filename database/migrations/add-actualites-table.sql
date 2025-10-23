-- Migration pour ajouter la table actualités
-- Date: 2024-01-XX
-- Description: Ajoute la table actualités pour gérer les actualités du festival

-- Table des actualités
CREATE TABLE IF NOT EXISTS "actualite" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "text" TEXT,
    "image" VARCHAR,
    "importance" VARCHAR NOT NULL DEFAULT 'Modéré' CHECK ("importance" IN ('Très important', 'Important', 'Modéré', 'Peu important')),
    "actif" BOOLEAN NOT NULL DEFAULT TRUE,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS "IDX_actualite_actif" ON "actualite" ("actif");
CREATE INDEX IF NOT EXISTS "IDX_actualite_importance" ON "actualite" ("importance");
CREATE INDEX IF NOT EXISTS "IDX_actualite_created_at" ON "actualite" ("created_at");

-- Appliquer le trigger pour mettre à jour automatiquement updated_at
DROP TRIGGER IF EXISTS update_actualite_updated_at ON "actualite";
CREATE TRIGGER update_actualite_updated_at 
    BEFORE UPDATE ON "actualite" 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insérer des données d'exemple
INSERT INTO "actualite" (title, description, text, image, importance, actif) VALUES
('Accès & Transport', 'Toutes les infos pour venir au festival.', 'Accès facile en train, bus et voiture.', '/images/transport.webp', 'Très important', true),
('Restauration', 'Découvrez nos stands et foodtrucks.', 'Une offre variée pour tous les goûts.', '/images/restauration.webp', 'Important', true),
('Objets trouvés', 'Un espace dédié pour retrouver vos objets.', 'Rendez-vous à l''accueil du festival.', '/images/objets-trouves.webp', 'Modéré', true),
('Nouvelle scène', 'Une nouvelle scène a été ajoutée cette année.', 'Venez découvrir la nouvelle scène découverte avec des artistes émergents.', '/images/nouvelle-scene.webp', 'Important', true),
('Parking gratuit', 'Parking gratuit disponible à proximité.', 'Un parking de 500 places est disponible gratuitement à 5 minutes du festival.', '/images/parking.webp', 'Important', true);

COMMIT;
