-- Migration pour mettre à jour les vues avec les nouvelles tables actualite et partenaire
-- Date: 2024-01-XX
-- Description: Ajoute les tables actualite et partenaire aux vues existantes

-- Mettre à jour la vue db_stats pour inclure les nouvelles tables
DROP VIEW IF EXISTS db_stats CASCADE;
CREATE VIEW db_stats AS
SELECT 
  'concert' AS table_name,
  COUNT(*) AS count,
  MAX(created_at) AS last_created
FROM concert
UNION ALL
SELECT 
  'day',
  COUNT(*),
  MAX(created_at)
FROM day
UNION ALL
SELECT 
  'poi',
  COUNT(*),
  MAX(created_at)
FROM poi
UNION ALL
SELECT 
  'security_info',
  COUNT(*),
  MAX(created_at)
FROM security_info
UNION ALL
SELECT 
  'user',
  COUNT(*),
  MAX(created_at)
FROM "user"
UNION ALL
SELECT 
  'actualite',
  COUNT(*),
  MAX(created_at)
FROM actualite
UNION ALL
SELECT 
  'partenaire',
  COUNT(*),
  MAX(created_at)
FROM partenaire
ORDER BY table_name;

-- Mettre à jour la vue full_db pour inclure les nouvelles tables
DROP VIEW IF EXISTS full_db CASCADE;
CREATE VIEW full_db AS
SELECT 'concert' AS source, row_to_json(c.*) AS data FROM concert c
UNION ALL
SELECT 'day', row_to_json(d.*) FROM day d
UNION ALL
SELECT 'poi', row_to_json(p.*) FROM poi p
UNION ALL
SELECT 'security_info', row_to_json(s.*) FROM security_info s
UNION ALL
SELECT 'user', row_to_json(u.*) FROM "user" u
UNION ALL
SELECT 'actualite', row_to_json(a.*) FROM actualite a
UNION ALL
SELECT 'partenaire', row_to_json(pa.*) FROM partenaire pa;

-- Mettre à jour la vue public_data pour inclure les nouvelles tables
DROP VIEW IF EXISTS public_data CASCADE;
CREATE VIEW public_data AS
SELECT 'concert' AS source, row_to_json(c.*) AS data FROM concert c
UNION ALL
SELECT 'day', row_to_json(d.*) FROM day d
UNION ALL
SELECT 'poi', row_to_json(p.*) FROM poi p
UNION ALL
SELECT 'security_info', row_to_json(s.*) FROM security_info s
UNION ALL
SELECT 'actualite', row_to_json(a.*) FROM actualite a
UNION ALL
SELECT 'partenaire', row_to_json(pa.*) FROM partenaire pa;
