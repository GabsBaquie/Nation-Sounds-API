-- Script de nettoyage de la base de données
-- Ce script supprime toutes les données des tables principales
-- ATTENTION: Ce script supprime TOUTES les données !

-- Désactiver les contraintes de clés étrangères temporairement
SET session_replication_role = replica;

-- Supprimer les relations d'abord
DELETE FROM concert_days_day;

-- Supprimer les données des tables principales
DELETE FROM security_info;
DELETE FROM poi;
DELETE FROM concert;
DELETE FROM day;
DELETE FROM actualite;
DELETE FROM partenaire;

-- Réactiver les contraintes
SET session_replication_role = DEFAULT;

-- Réinitialiser les séquences
ALTER SEQUENCE IF EXISTS partenaire_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS actualite_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS day_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS concert_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS poi_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS security_info_id_seq RESTART WITH 1;

-- Vérifier que les tables sont vides
SELECT 'Partenaires' as table_name, COUNT(*) as count FROM partenaire
UNION ALL
SELECT 'Actualités', COUNT(*) FROM actualite
UNION ALL
SELECT 'Jours', COUNT(*) FROM day
UNION ALL
SELECT 'Concerts', COUNT(*) FROM concert
UNION ALL
SELECT 'POI', COUNT(*) FROM poi
UNION ALL
SELECT 'Infos sécurité', COUNT(*) FROM security_info
UNION ALL
SELECT 'Relations concert-jour', COUNT(*) FROM concert_days_day;
