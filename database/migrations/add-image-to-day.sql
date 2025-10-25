-- Migration pour ajouter la colonne image à la table day
-- Date: 2024-01-XX
-- Description: Ajoute la colonne image pour les jours du festival

-- Ajouter la colonne image à la table day
ALTER TABLE "day" ADD COLUMN IF NOT EXISTS "image" VARCHAR;

-- Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS "IDX_day_image" ON "day" ("image");
