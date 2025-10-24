-- Créer une vue d'ensemble de toutes les données
CREATE OR REPLACE VIEW full_db AS
SELECT 'concert' AS source, row_to_json(c.*) AS data FROM concert c
UNION ALL
SELECT 'day', row_to_json(d.*) FROM day d
UNION ALL
SELECT 'poi', row_to_json(p.*) FROM poi p
UNION ALL
SELECT 'security_info', row_to_json(s.*) FROM security_info s
UNION ALL
SELECT 'user', row_to_json(u.*) FROM "user" u;

-- Créer une vue pour les données publiques (sans les utilisateurs)
CREATE OR REPLACE VIEW public_data AS
SELECT 'concert' AS source, row_to_json(c.*) AS data FROM concert c
UNION ALL
SELECT 'day', row_to_json(d.*) FROM day d
UNION ALL
SELECT 'poi', row_to_json(p.*) FROM poi p
UNION ALL
SELECT 'security_info', row_to_json(s.*) FROM security_info s;

-- Créer une vue pour les statistiques
CREATE OR REPLACE VIEW db_stats AS
SELECT 
  'concerts' AS table_name,
  COUNT(*) AS count,
  MAX(created_at) AS last_created
FROM concert
UNION ALL
SELECT 
  'days',
  COUNT(*),
  MAX(created_at)
FROM day
UNION ALL
SELECT 
  'pois',
  COUNT(*),
  MAX(created_at)
FROM poi
UNION ALL
SELECT 
  'security_infos',
  COUNT(*),
  MAX(created_at)
FROM security_info
UNION ALL
SELECT 
  'users',
  COUNT(*),
  MAX(created_at)
FROM "user";
