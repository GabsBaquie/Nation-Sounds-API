-- Migration pour mettre à jour les chemins des images des partenaires
-- Date: 2024-01-XX
-- Description: Met à jour les chemins des images pour utiliser /uploads/images/partenaires/ au lieu de /images/partenaires/

-- Mettre à jour les chemins des images des partenaires
UPDATE "partenaire" 
SET "image" = REPLACE("image", '/images/partenaires/', '/uploads/images/')
WHERE "image" LIKE '/images/partenaires/%';

-- Vérifier les mises à jour
SELECT id, name, image FROM "partenaire" WHERE "image" LIKE '%partenaires%';
