-- =====================================================
-- VUES D'ENSEMBLE DE LA BASE DE DONNÉES
-- =====================================================

-- Vue complète de toutes les données (avec utilisateurs)
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

-- Vue des données publiques (sans les utilisateurs)
CREATE OR REPLACE VIEW public_data AS
SELECT 'concert' AS source, row_to_json(c.*) AS data FROM concert c
UNION ALL
SELECT 'day', row_to_json(d.*) FROM day d
UNION ALL
SELECT 'poi', row_to_json(p.*) FROM poi p
UNION ALL
SELECT 'security_info', row_to_json(s.*) FROM security_info s;

-- Vue des statistiques par table
CREATE OR REPLACE VIEW db_stats AS
SELECT 
  'concerts' AS table_name,
  COUNT(*) AS count,
  MAX(created_at) AS last_created,
  MIN(created_at) AS first_created
FROM concert
UNION ALL
SELECT 
  'days',
  COUNT(*),
  MAX(created_at),
  MIN(created_at)
FROM day
UNION ALL
SELECT 
  'pois',
  COUNT(*),
  MAX(created_at),
  MIN(created_at)
FROM poi
UNION ALL
SELECT 
  'security_infos',
  COUNT(*),
  MAX(created_at),
  MIN(created_at)
FROM security_info
UNION ALL
SELECT 
  'users',
  COUNT(*),
  MAX(created_at),
  MIN(created_at)
FROM "user";

-- Vue des concerts avec leurs jours associés
CREATE OR REPLACE VIEW concerts_with_days AS
SELECT 
  c.*,
  COALESCE(
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'id', d.id,
        'title', d.title,
        'date', d.date,
        'created_at', d.created_at,
        'updated_at', d.updated_at
      )
    ) FILTER (WHERE d.id IS NOT NULL),
    '[]'::json
  ) as days
FROM concert c
LEFT JOIN concert_days_day cd ON c.id = cd."concertId"
LEFT JOIN day d ON cd."dayId" = d.id
GROUP BY c.id, c.created_at
ORDER BY c.created_at DESC;

-- Vue des jours avec leurs concerts associés
CREATE OR REPLACE VIEW days_with_concerts AS
SELECT 
  d.*,
  COALESCE(
    JSON_AGG(
      JSON_BUILD_OBJECT(
        'id', c.id,
        'title', c.title,
        'description', c.description,
        'performer', c.performer,
        'time', c.time,
        'location', c.location,
        'image', c.image,
        'created_at', c.created_at,
        'updated_at', c.updated_at
      )
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'::json
  ) as concerts
FROM day d
LEFT JOIN concert_days_day cd ON d.id = cd."dayId"
LEFT JOIN concert c ON cd."concertId" = c.id
GROUP BY d.id, d.created_at
ORDER BY d.created_at DESC;
